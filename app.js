require("dotenv").config()
const { connectDB } = require("./db/connect")
const express = require("express")
const { router: exercisesRouter } = require("./routes/exercisesRoute")
const { router: usersRouter } = require("./routes/usersRoute")
const Users = require('./models/users')
const app = express()
const cors = require('cors');
app.use(cors());

const port = 5000

app.use(express.json())
// ROUTES

app.use('/api/v1/exercises', exercisesRouter)

app.use('/api/v1/users', usersRouter)


app.use('/', async (req, res) => {
    /* const user = await Users.create({
        username: 'testUser4',
        password: '123',
        email: 'forpc',
    })
    user.createNewCollection('testcollection')
    const col = user.collections[0]
    col.createNewPlan('testPlan')
    const pl = col.plans[0]
    user.addExercise('66eb5c0c4cea158e1001518b', col._id.toString(), pl._id.toString(), 45, [12, 10, 8], 'kg', false)
    user.addExercise('66eb5c0c4cea158e1001518d', col._id.toString(), pl._id.toString(), 32, [11, 5, 3], 'kg', false)
    const added = user.addExercise('66eb5c0c4cea158e10015191', col._id.toString(), pl._id.toString(), 11, [1, 2, 3], 'pound', false)
    res.send(user) */
    /* try {
        const user1 = await Users.findById('6714309c5c46ed2fff4a290a')
        user1.createNewCollection('test Collection 2')
        const col = user1.collections[1]
        col.createNewPlan('testPlan2')
        const pl = col.plans[0]
        const added = user1.addExercise('66eb5c0c4cea158e1001518b', col._id.toString(), pl._id.toString(), 45, [12, 10, 8], 'kg', false)
        const added2 = user1.addExercise('66eb5c0c4cea158e1001518d', col._id.toString(), pl._id.toString(), 32, [11, 5, 3], 'kg', false)
        const added3 = user1.addExercise('66eb5c0c4cea158e10015191', col._id.toString(), pl._id.toString(), 34, [1, 2, 3], 'pound', false)
        console.log(typeof user1.exercises[1].collections[1].plans[0].data.currentReps.reps[0])
        res.send(user1)
    } catch (e) {
        console.log('error', e)
    } */
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