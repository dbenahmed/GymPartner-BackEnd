const express = require("express")
const { exercises } = require("./routes/exercises")

const app = express()
const port = 5000

// ROUTES

// GET SEARCH FOR EXERCISES BASED ON 
// /api/v1/exercises?type=hello&name=test
app.use('/api/v1/exercises/', exercises)


// GET EXERCISE INFORMATIONS
// /api/v1/exercises/exercise//id/:id

// GET SEARCH FOR EXERCISES PER NAME USING A DEPENDENCIE
// /api/v1/exercises/exercise/name/:name

// POST ADD EXERCISES TO THE USER PLAN
// /api/v1/:user/:plan/exercises

// GET RENDER PLAN EXERCISES
// /api/v1/:user/:plan/exercises

// DELETE REMOVE EXERCISES FROM USER PLAN
// /api/v1/:user/:plan/exercises

// PUT UPDATE USER PLAN EXERCISE REPS/WEIGHTS
// /api/v1/:user/:plan/exercises/:id?reps=12



app.listen(port)