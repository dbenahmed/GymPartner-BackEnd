require("dotenv").config()
const { connectDB } = require("./db/connect")
const express = require("express")
const { router: exercisesRouter } = require("./routes/exercises")


const app = express()
const port = 5000

// ROUTES

// /api/v1/exercises
app.use('/api/v1/exercises/', exercisesRouter)



// POST ADD EXERCISES TO THE USER PLAN
// /api/v1/:user/:plan/exercises

// GET RENDER PLAN EXERCISES
// /api/v1/:user/:plan/exercises

// DELETE REMOVE EXERCISES FROM USER PLAN
// /api/v1/:user/:plan/exercises

// PUT UPDATE USER PLAN EXERCISE REPS/WEIGHTS
// /api/v1/:user/:plan/exercises/:id?reps=12

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () => { console.log('server started') })
   } catch (error) {
      console.log(error)
   }
}

start()