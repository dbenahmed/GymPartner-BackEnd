const mongoose = require('mongoose')

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
    collectionId: {type: String, required: true}, plans: {
        type: [exercisePlansSchema], required: true
    },
}, {
    methods: {}
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
    }, PR: {
        type: Number, default: 0
    }
}, {
    methods: {
        checkIfArchived() {
            return this.archived
        }, // TODO : UPDATE THIS EXERCISE FUNCTION AFTER UPDATING EACH EXERCISE METHODS
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
            this.plans.push({
                planName
            })
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
        }, addCollection(name) {
            this.collections.push({
                name: name
            })
            this.updateUpdatedAt()
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
            const foundPlan = collection.getPlan('testplan')
            if (!foundPlan.success) {
                return {
                    success: false, response: foundPlan.response
                }
            }
            // if exercise is not found
            // add it with the new values and add the planID and collectionID
            if (!exercise) {
                this.exercises.push({
                    databaseId, collections: [{
                        collectionId, plans: [{
                            planId, data: {
                                weight, sets: reps.length, unit, currentReps: {
                                    reps,
                                }
                            }
                        }]
                    }]
                })
            } else {
                // Exercise already exists before
                /*if (exercise.checkIfArchived()) {
                    const foundCollection = exercise.collections.getCollection(collectionId)
                    if (foundCollection.success) {
                        const collection = foundCollection.response
                        const foundPlan = collection.getPlan()
                    }
                    // >>> ? exercise is archived
                    // NOTE THAT archived means exercise don't exist in any plan
                    // if user want selected reps and weights
                    // or last weights are worse than selected weights >
                    if (yesUseSelectedWeights || exercise.maxWeightAndSets.weight < weight || (exercise.maxWeightAndSets.weight === weight && exercise.maxWeightAndSets.reps[0] < reps[0])) {
                        // add the exercise with selected weight
                    } else {
                        // add exercise with best weights
                    }
                    // ++ add collection and planID to exercise db
                } else {
                    // >>> ? exercise is not archived
                    // add the selected reps and weights
                    // ++ add collection and planID to exercise db

                }*/
            }
        }
    }
})


module.exports = mongoose.model('Users', userSchema)