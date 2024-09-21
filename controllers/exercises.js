const { default: mongoose } = require("mongoose");
const ExercisesData = require("../models/exercisesData");

// Get exercises data using query parameters from the requeted url
const getExercisesByType = async (req, res) => {
   try {
      const limit = parseInt(req.query.limit) || 10
      const page = parseInt(req.query.page) || 1
      const searchParams = req.query;
      const searchParametersArray = Object.entries(searchParams)
      console.log(searchParametersArray);
      if (searchParametersArray.length !== 0) {
         const foundExercises = await ExercisesData.find({ ...searchParams }).skip(limit * (page - 1)).limit(limit)
         res.json({
            success: true,
            response: foundExercises
         }).status(200)
      } else {
         throw ('No Search Parameters Given')
      }
   } catch (error) {
      res.status(404).json({
         succes: false,
         response: error
      })
   }

}

const getExerciseById = async (req, res) => {
   try {
      const { id } = req.params
      const foundExercise = await ExercisesData.findById(id)
      res.status(200).json({
         success: true,
         response: foundExercise
      })
   } catch (error) {
      res.json({
         success: false,
         response: error
      })
   }


}

const getExercisesByName = async (req, res) => {
   try {
      const { name } = req.params
      const limit = (parseInt(req.query.limit) || 10)
      const page = (parseInt(req.query.page) || 1)
      const found = await ExercisesData.aggregate([
         {
            $search: {
               index: 'name',
               text: {
                  path: 'name',
                  query: name,
                  fuzzy: {}
               }
            }
         },
         {
            $skip: page * limit
         }, {
            $limit: limit
         }
      ])
      res.json({
         succes: true,
         response: found
      }).status(200)
   } catch (e) {
      res.json({
         success: false,
         response: e
      }).status(404)
   }

}

module.exports = {
   getExercisesByType,
   getExercisesByName,
   getExerciseById
}