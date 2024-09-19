const express = require("express")
const { getExercisesByType, getExercisesByName, getExerciseById } = require("../controllers/exercises")

const router = express.Router()

// GET SEARCH FOR EXERCISES BASED ON TYPE
// type=hello&name=test
router.route('/').get(getExercisesByType)


// GET EXERCISE INFORMATIONS
// /exercise/id/:id
router.route('/id/:id').get(getExerciseById)

// GET SEARCH FOR EXERCISES PER NAME USING A DEPENDENCIE
// /exercise/name/:name?page=2&limit=3
router.route('/name/:name').get(getExercisesByName)

module.exports = { router } 