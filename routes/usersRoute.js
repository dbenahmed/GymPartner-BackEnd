const express = require("express")
const {
    getCollectionsAndPlansNames,
    getExercisesOfPlan,
    createNewCollectionToUser,
    updateCollectionName,
    deleteWholeCollection,
    addExerciseToUserPlan,
} = require("../controllers/users")


const router = express.Router()

router.route('/:userId/collections').get(getCollectionsAndPlansNames)

router.route('/:userId/collections/:collectionId/plans/:planId').get(getExercisesOfPlan)

router.route('/collections/create').post(createNewCollectionToUser)

router.route('/collections/rename').patch(updateCollectionName)

router.route('/collections/delete').delete(deleteWholeCollection)

router.route('/collections/plans/add').post(addExerciseToUserPlan)

module.exports = { router }