require("dotenv").config()
const {connectDB} = require("./db/connect")
const express = require("express")
const {router: exercisesRouter} = require("./routes/exercisesRoute")
const {router: usersRouter} = require("./routes/usersRoute")
const User = require("./models/users")

const app = express()
const port = 5000

app.use(express.json())
// ROUTES

// /api/v1/exercises
app.use('/api/v1/exercises/', exercisesRouter)

app.use('/api/v1/users/', usersRouter)

app.use('/', async (req, res) => {
    const user = await User.findById('66f02c9cc418b5fd8994c4ec')
    user.createNewCollection('NewCollection')
    const colId = user.collections[0]._id.toString()
    const collection = user.getCollection(colId).response
    const plan = collection.createNewPlan('testplan')
    const planId = collection.plans[0]._id.toString()
    const exerciseAdded = user.addExercise('66eb5c0c4cea158e1001518b', colId, planId, 32, [12, 10, 8], 'kg', false)
    const exerciseAdded2 = user.addExercise('123test', colId, planId, 15, [10, 10, 8], 'pound', false)
    // REMAINS TESTING
    console.log(exerciseAdded2)
    res.send(user)
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log('server started')
        })
    } catch (error) {
        console.log(error)
    }
}

start()