const express = require("express")

const exercises = express.Router()
const backendExercises = require("../data/exercises.json")
const { getExercisesByType } = require("../controllers/getExercisesByType")

// GET SEARCH FOR EXERCISES BASED ON 
// /api/v1/exercises  ?type=hello&name=test
exercises.get('/', getExercisesByType)
module.exports = { exercises }