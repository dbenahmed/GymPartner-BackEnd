require("dotenv").config()
const { connectDB } = require("./db/connect")
const express = require("express")
const { router: exercisesRouter } = require("./routes/exercisesRoute")
const { router: usersRouter } = require("./routes/usersRoute")
const User = require("./models/users")

const app = express()
const port = 5000

// ROUTES

// /api/v1/exercises
app.use('/api/v1/exercises/', exercisesRouter)

app.use('/api/v1/users/', usersRouter)

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () => { console.log('server started') })
   } catch (error) {
      console.log(error)
   }
}

start()