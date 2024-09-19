const mongoose = require('mongoose')


const exercisesSchema = new mongoose.Schema({
   databaseId: {
      type: String,
      required: true
   },
   weight: {
      type: Number,
      required: true
   },
   unit: {
      type: String,
      required: true,
      default: 'kg'
   },
   sets: {
      type: Number,
   },
   currentReps: {
      type: {
         reps: {
            type: [Number]
         },
         addedAt: {
            type: Date,
            default: Date.now()
         }
      },
      required: true
   },
   previousReps: {
      type: [
         {
            reps: {
               type: [Number]
            },
            addedAt: {
               type: Date,
               default: Date.now()
            }
         }
      ],
      default: []
   }
}, {
   methods: {
      setNewData(newWeight, newReps, newUnit, archive) {
         if (!archive) {
            this.weight = newWeight
            this.currentReps.reps = newReps
            this.currentReps.addedAt = new Date(Date.now())
            this.unit = newUnit
         } else {
            this.previousReps.push(this.currentReps)
            this.weight = newWeight
            this.currentReps.reps = newReps
            this.currentReps.addedAt = new Date(Date.now())
            this.unit = newUnit
         }
      },
   }
})

const plansSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   exercises: {
      type: [exercisesSchema],
      default: []
   },
   archivedExercises: {
      type: [exercisesSchema],
      default: []
   },
}, {
   methods: {
      addExercise(databaseId, weight, reps, unit) {
         // Looking for the exo if it exists the archived exos before adding it
         const index = this.archivedExercises.findIndex((val) => val.databaseId === databaseId)
         if (index === -1) {
            this.exercises.push({
               databaseId,
               weight,
               unit,
               sets: reps.length,
               currentReps: {
                  reps,
                  addedAt: Date.now()
               },
               previousReps: []
            })
         } else {

            const prevReps = [
               ...this.archivedExercises[index].previousReps.toObject(),
               // @ts-ignore
               this.archivedExercises[index].currentReps.toObject(),
            ]
            const data = {
               ...this.archivedExercises[index].toObject()
            }
            this.exercises.push({
               ...data,
               weight,
               sets: reps.length,
               currentReps: {
                  reps,
                  addedAt: Date.now()
               },
               previousReps: prevReps
            })

            this.archivedExercises.splice(index, 1)
         }
      }, addArchivedExercise(databaseId, weight, reps) {
         this.archivedExercises.push({
            databaseId,
            weight,
            sets: 5,
            currentReps: {
               reps,
               addedAt: Date.now()
            },
            previousReps: []
         })
      },
      removeExercise(id, doWeArchive) {
         const indexOfExercise = this.exercises.findIndex((val) => val._id === id)
         if (indexOfExercise !== -1) {
            if (doWeArchive) {
               this.archivedExercises.push(this.exercises[indexOfExercise])
            }
            this.exercises.splice(indexOfExercise, 1)
         } else {
            console.log('exercise not found')
         }
      },
      removeArchivedExercise(id) {
         const indexOfExercise = this.archivedExercises.findIndex((val) => val._id === id)
         if (indexOfExercise !== -1) {
            this.archivedExercises.splice(indexOfExercise, 1)
         } else {
            console.log('exercise not found')
         }
      }
   }
})

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
   },
   email: {
      required: true,
      type: String,
      lowercase: true
   },
   displayName: {
      type: String,
   },
   password: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now()
   },
   updatedAt: {
      type: Date,
      default: () => Date.now()
   },
   plans: {
      type: [plansSchema],
      default: []
   }
}, {
   methods: {
      updateUpdatedAt() {
         // @ts-ignore
         this.updatedAt = Date.now()
      },
      changeUsername(newUsername) {
         this.username = newUsername
         // @ts-ignore
         this.updateUpdatedAt()
      },
      changeEmail(newEmail) {
         this.email = newEmail
         // @ts-ignore
         this.updateUpdatedAt()
      },
      changePassword(newPassword) {
         this.password = newPassword
         // @ts-ignore
         this.updateUpdatedAt()
      },
      addPlan(planName) {
         this.plans.push({
            name: planName
         })
         // @ts-ignore
         this.updateUpdatedAt()
      }
   }
})



module.exports = mongoose.model('Users', userSchema)