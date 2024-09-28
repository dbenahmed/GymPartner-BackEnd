const mongoose = require("mongoose")
const {compareWeights} = require("../utils/compareWeights")

const exercisePlansSchema = new mongoose.Schema({
    planId: {
        type: String, required: true
    }, data: {
        type: {
            weight: {
                type: Number, default: 0
            }, sets: {
                type: Number, default: 0
            }, unit: {
                type: String, default: 'kg'
            }, currentReps: {
                type: {
                    reps: {
                        type: [Number]
                    }, addedAt: {
                        type: Date, default: Date.now()
                    }
                }, required: true
            },
        }
    }
}, {
    methods: {}
})


const exerciseCollectionSchema = new mongoose.Schema({
    collectionId: {type: String, required: true},
    plans: {
        type: [exercisePlansSchema], required: true, default: []
    },
}, {
    methods: {
        getPlan(planId) {
            const foundPlan = this.plans.find(v => v.planId === planId)
            console.log(foundPlan)
            if (!foundPlan) {
                return {
                    success: false,
                    response: 'plan not found in this exercise collection'
                }
            }
            return {
                success: true,
                response: foundPlan
            }
        }
    }
})


const exerciseSchema = new mongoose.Schema({
    databaseId: {
        type: String, required: true
    }, collections: {
        type: [exerciseCollectionSchema]
    }, previousReps: {
        type: [{
            reps: [Number], whichCollection: String, whichPlan: String, addedAt: {
                type: Date, default: Date.now()
            }
        }], default: []
    }, maxWeightAndSets: {
        type: {
            weight: {
                type: Number
            }, unit: {
                type: String
            }, reps: {
                type: [Number], default: []
            }, updatedAt: {
                type: Date, default: Date.now()
            }
        }, default: {
            weight: 0, unit: 'kg',
        }
    }, archived: {
        type: Boolean, default: false
    }, pr: {
        type: {
            weight: {type: Number, default: 0},
            unit: {type: String, default: 'kg'}
        }

    }
}, {
    methods: {
        checkIfArchived() {
            return this.archived
        }, getCollection(collectionId) {
            const collection = this.collections.find(v => v.collectionId === collectionId)
            if (!collection) {
                return {
                    success: false
                }
            }
            return {
                success: true,
                response: collection
            }
        }, addToExerciseCollectionAndPlan(collectionId, planId, weight, unit, reps) {
            const foundCollection = this.getCollection(collectionId)
            if (!foundCollection.success) {
                this.collections.push({
                    collectionId,
                    plans: [{
                        planId,
                        data: {
                            weight, sets: reps.length, unit, currentReps: {reps}
                        }
                    }]
                })
                return {
                    success: true,
                }
            } else {
                const collection = foundCollection.response
                console.log('colleciton', collection)
                const foundPlan = collection.getPlan(planId)
                if (!foundPlan.success) {
                    collection.plans.push({
                        planId,
                        data: {
                            weight, sets: reps.length, unit, currentReps: {reps}
                        }
                    })
                    return {
                        success: true
                    }
                } else {
                    return {
                        success: false,
                        response: 'Exercise Already Exists'
                    }
                }

            }
        }
    }
})

// -------

const planSchema = new mongoose.Schema({
    planName: {
        type: String, required: true
    }, planExercises: {
        type: [String], default: []
    }
}, {
    methods: {
        changePlanName(newPlanName) {
            this.planName = newPlanName
            return {
                success: true
            }
        }, addExerciseToPlan(databaseId) {
            const index = this.planExercises.findIndex(v => v === databaseId)
            if (index !== -1) {
                this.planExercises.push(databaseId)
                return {
                    success: true
                }
            } else {
                return {
                    success: false, response: 'Exercise Already Exists in this Plan'
                }
            }
        }, removeExerciseFromPlan(databaseId) {
            const index = this.planExercises.findIndex(v => v === databaseId)
            if (index !== -1) {
                this.planExercises.splice(index, 1)
                return {
                    success: true
                }
            } else {
                return {
                    success: false, response: 'Exercise not found'
                }
            }
        }
    }
})


const collectionSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    }, plans: {
        type: [planSchema], default: []
    }
}, {
    methods: {
        changeCollectionName(newName) {
            this.name = newName
            return {
                success: true
            }
        }, createNewPlan(planName) {
            const planExist = this.plans.find(v => v.planName === planName)
            if (planExist) {
                this.plans.push({
                    planName: `${planName}-Other`
                })
            } else {
                this.plans.push({
                    planName: `${planName}`
                })
            }
            return {
                success: true
            }
        }, removePlan(planId) {
            const index = this.plans.findIndex(v => v._id.toString() === planId)
            if (index !== -1) {
                this.plans.splice(index, 1)
                return {
                    success: true
                }
            } else {
                return {
                    success: false, response: 'plan not found in the database'
                }
            }
        }, getPlan(planId) {
            const index = this.plans.findIndex(v => v._id.toString() === planId)
            if (index !== -1) {
                return {
                    success: true, response: this.plans[index]
                }
            } else {
                return {
                    success: false, response: 'Plan Not Found'
                }
            }
        },
    }
})


const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true
    }, email: {
        required: true, type: String, lowercase: true
    }, displayName: {
        type: String,
    }, password: {
        type: String, required: true
    }, createdAt: {
        type: Date, immutable: true, default: () => Date.now()
    }, updatedAt: {
        type: Date, default: () => Date.now()
    }, collections: {
        type: [collectionSchema], default: [],
    }, exercises: {
        type: [exerciseSchema], default: []
    }
}, {
    methods: {
        updateUpdatedAt() {
            this.updatedAt = Date.now()
        }, changeUsername(newUsername) {
            this.username = newUsername
            // @ts-ignore
            this.updateUpdatedAt()
        }, changeEmail(newEmail) {
            this.email = newEmail
            // @ts-ignore
            this.updateUpdatedAt()
        }, changePassword(newPassword) {
            this.password = newPassword
            // @ts-ignore
            this.updateUpdatedAt()
        }, createNewCollection(name) {
            const collectionExists = this.collections.find(v => v.name === name)
            if (collectionExists) {
                this.collections.push({
                    name: `${name}-Other`
                })
            } else {
                this.collections.push({
                    name: name
                })
            }
            this.updateUpdatedAt()
            return {
                success: true
            }
        }, getCollection(collectionId) {
            const index = this.collections.findIndex(v => v._id.toString() === collectionId)
            if (index !== -1) {
                return {
                    success: true, response: this.collections[index]
                }
            } else {
                return {
                    success: false, response: 'Collection not Found'
                }
            }
        }, addExercise(databaseId, collectionId, planId, weight, reps, unit, yesUseSelectedWeights) {
            // check whether the exercise exists already in user exercises
            const exercise = this.exercises.find(v => v.databaseId === databaseId)
            // check whether collection exists
            const foundCollection = this.getCollection(collectionId)
            if (!foundCollection.success) {
                return {success: false, response: foundCollection.response}
            }
            const collection = foundCollection.response
            const foundPlan = collection.getPlan(planId)
            if (!foundPlan.success) {
                return {
                    success: false, response: foundPlan.response
                }
            }
            const plan = foundPlan.response
            // if exercise is not found
            // add it with the new values and add the planID and collectionID
            if (!exercise) {
                const addedToPlan = plan.addExerciseToPlan(databaseId)
                if (!addedToPlan) {
                    return {
                        success: false,
                        response: addedToPlan.response
                    }
                }
                this.exercises.push({
                    databaseId, collections: [{
                        collectionId, plans: [{
                            planId, data: {
                                weight, sets: reps.length, unit, currentReps: {
                                    reps,
                                }
                            }
                        }]
                    }], maxWeightAndSets: {
                        weight, unit, reps
                    },
                    pr: {
                        weight: weight,
                        unit: unit
                    }
                })
                // update plan
                return {
                    success: true
                }
            } else {
                // Exercise already exists before
                if (exercise.checkIfArchived()) {
                    // >>> ? exercise is archived
                    // NOTE THAT archived means exercise don't exist in any plan
                    // if user want selected reps and weights
                    // or last weights are worse than selected weights >
                    if (yesUseSelectedWeights || (compareWeights(exercise.maxWeightAndSets.weight, weight, exercise.maxWeightAndSets.unit, unit) === 's') || ((compareWeights(exercise.maxWeightAndSets.weight, weight, exercise.maxWeightAndSets.unit, unit) === 'e') && exercise.maxWeightAndSets.reps[0] < reps[0])) {
                        // add the exercise with selected weight
                        const addedToExerciseColAndPlan = exercise.addToExerciseCollectionAndPlan(collectionId, planId, weight, reps, reps)
                        if (!addedToExerciseColAndPlan.succes) {
                            return {
                                success: false,
                                response: 'ERROR FAILED TO addToExerciseCollectionAndPlan'
                            }
                        }
                        // update max weight
                        if (compareWeights(weight, exercise.maxWeightAndSets.weight, unit, exercise.maxWeightAndSets.unit) === 'g') {
                            exercise.maxWeightAndSets.weight = weight
                            exercise.maxWeightAndSets.reps = reps
                            exercise.maxWeightAndSets.unit = unit
                        } else if ((compareWeights(weight, exercise.maxWeightAndSets.weight, unit, exercise.maxWeightAndSets.unit) === 'e') && reps[0] > exercise.maxWeightAndSets.reps[0]) {
                            exercise.maxWeightAndSets.reps = reps
                            exercise.maxWeightAndSets.unit = unit
                        }
                        // update plan
                        const addedToPlan = plan.addExerciseToPlan(databaseId)
                        if (!addedToPlan) {
                            return {
                                success: false,
                                response: addedToPlan.response
                            }
                        }
                        // update archived
                        exercise.archived = false
                        // update PR
                        if (compareWeights(weight, exercise.pr.weight, unit, exercise.pr.unit) === 'g') {
                            exercise.pr.weight = weight
                            exercise.pr.unit = unit
                        }
                        return {
                            success: true
                        }
                    } else {
                        // add exercise with best weights
                        if ((compareWeights(weight, exercise.maxWeightAndSets.weight, unit, exercise.maxWeightAndSets.unit) === 'g') || ((compareWeights(weight, exercise.maxWeightAndSets.weight, unit, exercise.maxWeightAndSets.unit) === 'e') && reps[0] > exercise.maxWeightAndSets.reps[0])) {
                            // select given weights
                            // ++ add collection and planID to exercise db
                            const addedToExerciseColAndPlan = exercise.addToExerciseCollectionAndPlan(collectionId, planId, weight, unit, reps)
                            if (!addedToExerciseColAndPlan) {
                                return {
                                    success: false,
                                    response: addedToExerciseColAndPlan.response
                                }
                            }
                        } else {
                            // select max weights
                            const maxWeight = exercise.maxWeightAndSets.weight
                            const maxReps = exercise.maxWeightAndSets.reps
                            const maxUnit = exercise.maxWeightAndSets.unit
                            // ++ add collection and planID to exercise db
                            const addedToExerciseColAndPlan = exercise.addToExerciseCollectionAndPlan(collectionId, planId, maxWeight, maxUnit, maxReps)
                            if (!addedToExerciseColAndPlan) {
                                return {
                                    success: false,
                                    response: addedToExerciseColAndPlan.response
                                }
                            }
                        }
                        // update user Plan
                        const addedToPlan = plan.addExerciseToPlan(databaseId)
                        if (!addedToPlan) {
                            return {
                                success: false,
                                response: addedToPlan.response
                            }
                        }

                        // update archived
                        exercise.archived = false
                        // update PR
                        if (compareWeights(exercise.maxWeightAndSets.weight, exercise.pr.weight, exercise.maxWeightAndSets.unit, exercise.pr.unit) === 'g') {
                            exercise.pr.weight = exercise.maxWeightAndSets.weight
                            exercise.pr.unit = exercise.maxWeightAndSets.unit
                        }
                        return {
                            success: true
                        }
                    }

                } else {
                    // >>> ? exercise is not archived
                    // add the exercise with selected weight
                    // ++ add collection and planID to exercise db
                    const addedToExerciseColAndPlan = exercise.addToExerciseCollectionAndPlan(collectionId, planId, weight, reps, reps)
                    if (!addedToExerciseColAndPlan.succes) {
                        return {
                            success: false,
                            response: addedToExerciseColAndPlan.response
                        }
                    }
                    // update max weight
                    if (compareWeights(weight, exercise.maxWeightAndSets.weight, unit, exercise.maxWeightAndSets.unit) === 'g') {
                        exercise.maxWeightAndSets.weight = weight
                        exercise.maxWeightAndSets.reps = reps
                        exercise.maxWeightAndSets.unit = unit
                    } else if ((compareWeights(weight, exercise.maxWeightAndSets.weight, unit, exercise.maxWeightAndSets.unit) === 'e') && reps[0] > exercise.maxWeightAndSets.reps[0]) {
                        exercise.maxWeightAndSets.reps = reps
                        exercise.maxWeightAndSets.unit = unit
                    }
                    // update plan
                    const addedToPlan = plan.addExerciseToPlan(databaseId)
                    if (!addedToPlan) {
                        return {
                            success: false,
                            response: addedToPlan.response
                        }
                    }
                    // update archived
                    exercise.archived = false
                    // update PR
                    if (compareWeights(weight, exercise.pr.weight, unit, exercise.pr.unit) === 'g') {
                        exercise.pr.weight = weight
                        exercise.pr.unit = unit
                    }
                    return {
                        success: true
                    }
                }
            }
        }
    }
})


module.exports = mongoose.model('Users', userSchema)