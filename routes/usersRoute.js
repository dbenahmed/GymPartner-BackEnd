const express = require("express")
const {
   getUserAllPlansAndExercises,
   addNewPlanToUsersPlans,
   addNewExercisesToUserPlan,
   removeExerciseFromUserPlan,
   updateUserPlanExerciseData
} = require("../controllers/users")


const router = express.Router()

// GET USER PLAN EXERCISES
// /api/v1/users/:userid/:plans
router.route('/:id/plans').get(getUserAllPlansAndExercises)

// POST ADD NEW PLAN TO USERS PLANS
router.route('/plans').post(addNewPlanToUsersPlans)

// POST ADD EXERCISES TO THE USER PLAN
router.route('/plans/exercises').post(addNewExercisesToUserPlan)

// DELETE REMOVE EXERCISES FROM USER PLAN
router.route('/plans/exercises').delete(removeExerciseFromUserPlan)

// PUT UPDATE USER PLAN EXERCISE REPS/WEIGHTS
router.route('/plans/exercises').patch(updateUserPlanExerciseData)
// /api/v1/:user/:plan/exercises/:id?reps=12


module.exports = { router }