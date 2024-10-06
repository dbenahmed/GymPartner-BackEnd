require("dotenv").config()
const { connectDB } = require("./db/connect")
const express = require("express")
const { router: exercisesRouter } = require("./routes/exercisesRoute")
const { router: usersRouter } = require("./routes/usersRoute")
const Users = require('./models/users')

const app = express()
const port = 5000

app.use(express.json())
// ROUTES

app.use('/api/v1/exercises', exercisesRouter)

app.use('/api/v1/users', usersRouter)


/* app.use('/', async (req, res) => {
    const user = await Users.findById('66f02c9cc418b5fd8994c4ed')
    user.createNewCollection('testcollection')
    const col = user.collections[0]
    col.createNewPlan('testPlan')
    const pl = col.plans[0]
    user.addExercise('66eb5c0c4cea158e1001518c', col._id.toString(), pl._id.toString(), 45, [12, 10, 8], 'kg', false)
    user.addExercise('66eb5c0c4cea158e1001518d', col._id.toString(), pl._id.toString(), 32, [11, 5, 3], 'kg', false)
    user.addExercise('66eb5c0c4cea158e1001518f', col._id.toString(), pl._id.toString(), 11, [1, 2, 3], 'pound', false)
    
    console.log(user)
    
})
 */
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