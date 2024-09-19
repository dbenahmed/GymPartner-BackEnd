const express = require("express")
const { getUserPlanExercises } = require("../controllers/users")


const router = express.Router()

router.route('/:id').get(getUserPlanExercises)


// POST ADD EXERCISES TO THE USER PLAN
// /api/v1/:user/:plan/exercises

// GET RENDER PLAN EXERCISES
// /api/v1/:user/:plan/exercises

// DELETE REMOVE EXERCISES FROM USER PLAN
// /api/v1/:user/:plan/exercises

// PUT UPDATE USER PLAN EXERCISE REPS/WEIGHTS
// /api/v1/:user/:plan/exercises/:id?reps=12


module.exports = { router }