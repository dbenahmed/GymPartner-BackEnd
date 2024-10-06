const Users = require("../models/users")
const ExercisesData = require("../models/exercisesData")

// GET USER PLANS EXERCISES
const getCollectionsAndPlansNames = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await Users.findById(userId)
        const collections = user.collections
        res.json({
            success: true,
            response: collections
        }).status(202)
    } catch
    (e) {
        res.json({
            success: false,
            response: e
        }).status(404)
    }
}

const getExercisesOfPlan = async (req, res) => {
    try {
        const { userId, collectionId, planId } = req.body
        const user = await Users.findById(userId)
        const foundCollection = await user.getCollection(collectionId)
        if (!foundCollection.success) {
            res.json({
                success: false,
                response: 'Collection Not Found'
            }).status(404)
            return
        }
        const collection = foundCollection.response
        const foundPlan = await collection.getPlan(planId)
        if (!foundPlan.success) {
            res.json({
                success: false,
                response: 'Plan Not Found'
            }).status(404)
            return
        }
        const plan = foundPlan.response
        const exercises = plan.planExercises

        const exercisesDataResponse = await Promise.all(exercises.map(async (databaseId) => {
            const exerciseData = await ExercisesData.findById(databaseId)
            const name = exerciseData.name
            const foundExercise = user.exercises.find(v => v.databaseId === databaseId)
            const foundCollection = foundExercise.getCollection(collectionId)
            if (!foundCollection.success) {
                res.json({
                    success: false,
                    response: 'Collection Not Found'
                }).status(404)
                return
            }
            const collection = foundCollection.response
            const foundPlan = collection.getPlan(planId)
            if (!foundPlan.success) {
                res.json({
                    success: false,
                    response: 'Plan Not Found'
                }).status(404)
                return
            }
            const plan = foundPlan.response
            const data = plan.data
            return {
                databaseId,
                name,
                data: plan.data
            }
        }))
        res.json({
            success: true,
            response: exercisesDataResponse
        }).status(202)
    } catch (e) {
        res.json({
            success: false,
            response: e
        }).status(404)
    }
}

const createNewCollectionToUser = async (req, res) => {
    try {
        const {
            userId,
            collectionName
        } = req.body
        const user = await Users.findById(userId)
        const createdNewCollection = user.createNewCollection(collectionName)
        if (!createdNewCollection.success) {
            res.json({
                success: false,
                response: createdNewCollection.response
            }).status(404)
        }
        res.json({
            success: true
        }).status(202)
    } catch (e) {
        res.json({ success: false, response: e })
    }
}

const updateCollectionName = async (req, res) => {
    try {
        const {
            userId,
            collectionId,
            newCollectionName
        } = req.body
        const user = await Users.findById(userId)
        const foundCollection = user.getCollection(collectionId)
        if (!foundCollection.success) {
            res.json({
                success: false,
                response: 'Collection Not Found'
            }).status(404)
        }
        const collection = foundCollection.response
        collection.name = newCollectionName
        res.json({
            success: true
        }).status(202)
    } catch (e) {
        res.json({
            success: false,
            response: e
        }).status(404)
    }
}


const deleteWholeCollection = async (req, res) => {
    try {
        const {
            userId,
            collectionId
        } = req.body
        const user = await Users.findById(userId)
        const deletedCollection = user.deleteWholeCollection(collectionId)
        if (!deletedCollection.success) {
            res.json({
                success: false,
                response: deletedCollection.response
            }).status(404)
        }
        console.log(user)
        res.json({
            success: true
        }).status(202)
    } catch (e) {
        res.json({
            success: false,
            response: e
        }).status(404)
    }
}

module.exports = { getCollectionsAndPlansNames, getExercisesOfPlan, createNewCollectionToUser, updateCollectionName, deleteWholeCollection }