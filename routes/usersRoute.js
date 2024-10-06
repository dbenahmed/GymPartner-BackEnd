const express = require("express")
const {
    getCollectionsAndPlansNames,
    getExercisesOfPlan,
    createNewCollectionToUser,
    updateCollectionName,
    deleteWholeCollection,
} = require("../controllers/users")


const router = express.Router()

router.route('/:userId/collections').get(getCollectionsAndPlansNames)

router.route('/:user/collections/:collection/plans/:plan').get(getExercisesOfPlan)

router.route('/collections/create').post(createNewCollectionToUser)

router.route('/collections/rename').patch(updateCollectionName)

router.route('/collections/delete').delete(deleteWholeCollection)
module.exports = { router }