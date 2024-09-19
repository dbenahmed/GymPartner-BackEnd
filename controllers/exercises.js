const { default: mongoose } = require("mongoose");
const backendExercises = require("../data/exercises.json");
const ExercisesData = require("../models/exercisesData");

// Get exercises data using query parameters from the requeted url
const getExercisesByType = async (req, res) => {
   try {
      const searchParams = req.query;
      const searchParametersArray = Object.entries(searchParams)
      console.log(searchParams);
      if (searchParametersArray.length !== 0) {
         const foundExercises = await ExercisesData.find({ ...searchParams })
         res.json({
            success: true,
            response: foundExercises,
            message: 'Fetching Success Found Exercises'
         }).status(201)
      } else {
         throw ('No Search Parameters Given')
      }
   } catch (error) {
      res.status(404).json({
         succes: false,
         message: error
      })
   }

}

const getExerciseById = async (req, res) => {
   try {
      const { id } = req.params
      const foundExercise = await ExercisesData.findById(id)
      res.status(201).json({
         success: true,
         response: foundExercise
      })
   } catch (error) {
      res.json({
         success: false,
         message: error
      })
   }


}

const getExercisesByName = (req, res) => {
   ExercisesData.aggregate().search({
      "count":5,
   })
   res.send("heloo")
}

module.exports = {
   getExercisesByType,
   getExercisesByName,
   getExerciseById
}