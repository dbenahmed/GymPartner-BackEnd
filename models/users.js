const mongoose = require('mongoose')


const exerciseSchema = new mongoose.Schema({
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
   collections: {
      type: [
         {
            collectionId: {
               type: String,
               required: true
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
            },
         }
      ]
   },
   maxWeightAndSets: {
      type: {
         weight: {
            type: Number
         },
         unit: {
            type: String
         },
         updatedAt: {
            type: Date,
            default: Date.now()
         }
      },
      default: {
         weight: 0,
         unit: 'kg',
      }
   },
   archived: {
      type: Boolean,
      default: false
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
   collections: {
      type: [
         {
            name: {
               type: String,
               required: true
            },
            plansIds: [String]
         }
      ],
      default: []
   },
   exercises: {
      type: [exercisesSchema],
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
      addCollection(collectionName) {
         this.collections.push({
            name: collectionName
         })
         // @ts-ignore
         this.updateUpdatedAt()
      }
   }
}
)



module.exports = mongoose.model('Users', userSchema)