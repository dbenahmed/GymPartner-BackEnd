const express = require("express")
const User = require("./models/users")
const ExercisesData = require("./models/exercisesData")
const app = express()
const data = require("./data/exercisesdata.json")
const mongoose = require("mongoose")
app.get('/exercises', async (req, res) => {

})

const connect = async () => {
   try {
      await mongoose.connect('mongodb://127.0.0.1:27017/myapp')
      app.listen(3500, () => console.log('test started'))
   } catch (error) {
      console.log(error)
   }
}


connect()