const express = require("express")
const { getExercisesByType, getExercisesByName, getExerciseById } = require("../controllers/exercises")

const router = express.Router()

// GET SEARCH FOR EXERCISES BASED ON TYPE
// type=hello&name=test
router.route('/').get(getExercisesByType)


// GET EXERCISE INFORMATIONS
// /exercise/id/:id
router.route('/exercise/:id').get(getExerciseById)

// GET SEARCH FOR EXERCISES PER NAME USING A DEPENDENCIE
// /exercise/name/:name
router.route('/exercise/:name').get(getExercisesByName)

module.exports = { router }