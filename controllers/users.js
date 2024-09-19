const Users = require("../models/users")




// GET USER PLANS EXERCISES
const getUserAllPlans = async (req, res) => {
   try {
      const { username } = req.params
      const user = await Users.findOne({ "username": username })
      if (!user) {
         res.json({
            succes: false,
            response: 'User not found'
         }).status(404)
         return
      }
      const exercisesResponse = user.plans.map(plan => {
         return {
            "name": plan.name,
            "exercises": plan.exercises
         }
      })
      res.json({
         sucess: true,
         response: exercisesResponse
      })
   }
   catch (e) {
      res.json({
         success: false,
         response: e
      }).status(404)
   }
}

// POST ADD NEW PLAN TO USERS PLANS
const addNewPlanToUsersPlans = async (req, res) => {
   try {
      const { id } = req.params
      const { name } = req.body
      const user = await Users.findById(id)
      if (!user) {
         res.json({
            success: false,
            response: 'User not found'
         }).status(404)
         return
      }
      user.plans.push({
         "name": name
      })
      user.save()
      res.json({
         succes: true,
         response: 'Added new plan to the user successfully'
      }).status(201)
   }
   catch (e) {
      res.json({
         success: false,
         response: e
      }).status(404)
   }
}

// POST ADD EXERCISES TO THE USER PLAN
const addNewExercisesToUserPlan = async (req, res) => {
   try {
      const { databaseId, weight, reps, unit, planId, userId } = req.body
      const user = await Users.findById(userId)
      if (!user) {
         res.json({
            success: false,
            response: 'User not found'
         }).status(404)
         return
      }
      const plan = user.plans.find(v => v._id.toString() === planId)
      if (!plan) {
         res.json({
            succes: false,
            response: 'Plan not found'
         }).status(404)
         return
      }
      // @ts-ignore
      await plan.addExercise(databaseId, weight, reps, unit)
      await user.save()
      res.json({
         succes: true,
         response: 'Added exercise to plan'
      }).status(201)
   } catch (e) {
      res.json({
         success: false,
         response: e
      }).status(404)
   }
}
// DELETE REMOVE EXERCISES FROM USER PLAN
const removeExerciseFromUserPlan = async (req, res) => {
   try {
      const { exerciseId, planId, userId } = req.body
      const user = await Users.findById(userId)
      if (user) {
         const plan = user.plans.find(val => val._id.toString() === planId)
         if (plan) {
            const exerciseIndex = plan.exercises.findIndex(val => val._id.toString() === exerciseId)
            if (exerciseIndex !== -1) {
               plan.exercises.splice(exerciseIndex, 1)
               res.json({
                  success: true,
                  response: 'Exercise deleted successfully'
               }).status(201)
            }
         }
      }
   } catch (error) {
      res.json({
         success: false,
         response: error
      })
   }
}

// PUT UPDATE USER PLAN EXERCISE REPS/WEIGHTS
const updateUserPlanExerciseData = async (req, res) => {
   try {
      const { userId, planId, exerciseId, weight, reps, unit, archive } = req.body
      const user = await Users.findById(userId)
      if (!user) {
         res.json({
            succes: false,
            response: 'User not found'
         }).status(404)
         return
      }
      const plan = user.plans.find(v => v._id.toString() === planId)
      if (!plan) {
         res.json({
            success: false,
            response: 'Plan not found'
         }).status(404)
         return
      }
      const exercise = plan.exercises.find(v => v._id.toString() === exerciseId)
      if (!exercise) {
         res.json({
            success: false,
            response: 'Exercise not found'
         }).status(404)
         return
      }
      // @ts-ignore
      exercise.setNewData(weight, reps, unit, archive)
      user.save()
      res.json({
         succes: true,
         response: 'Exercise updated successfully'
      })
   } catch (error) {
      res.json({
         success: false,
         response: error
      })
   }
}

module.exports = { getUserAllPlans, addNewPlanToUsersPlans, addNewExercisesToUserPlan, removeExerciseFromUserPlan, updateUserPlanExerciseData }