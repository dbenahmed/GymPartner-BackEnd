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
    const user = await User.findOne({username: 'user1'})
    user.addCollection('NewCollection')
    const colId = user.collections[0]._id.toString()
    const collection = user.getCollection(colId).response
    console.log(collection)
    const exerciseAdded = user.addExercise('testDataId', colId, 'uknownplan', 32, [12, 10, 8], 'kg', true)
    console.log(collection)
    console.log(exerciseAdded)
    res.send('done')
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