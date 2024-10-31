const mongoose = require('mongoose')

const exerciseDataSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      force: {
         type: String,
         lowercase: true,
      },
      level: {
         type: String,
         lowercase: true,
      },
      mechanic: {
         type: String,
         lowercase: true,
      },
      equipment: {
         type: String,
         lowercase: true,
      },
      primaryMuscles: {
         type: [String],
         lowercase: true,
         required: true,
         default: []
      },
      secondaryMuscles: {
         type: [String],
         lowercase: true,
         required: true,
         default: []
      },
      instructions: {
         type: [String],
         required: true,
      },
      category: {
         type: String,
         lowercase: true,
      },
      images: {
         type: [String],
         required: true
      },
   }, {
   methods: {
      getData(key) {
         switch (key) {
            case 'name':
               return this.name
            case 'force':
               return this.force
            case 'level':
               return this.level
            case 'mechanic':
               return this.mechanic
            case 'equipment':
               return this.equipment
            case 'primaryMuscles':
               return this.primaryMuscles
            case 'secondaryMuscles':
               return this.secondaryMuscles
            case 'instructions':
               return this.instructions
            case 'category':
               return this.category
            case 'images':
               return this.images
            case '_id':
               return this._id
            default: this._id
         }
      },
      addData(key, value) {
         switch (key) {
            case 'name':
               this.name = key
               break;
            case 'force':
               this.force = value
               break;
            case 'level':
               this.level = value
               break;
            case 'mechanic':
               this.mechanic = value
               break;
            case 'equipment':
               this.equipment = value
               break;
            case 'primaryMuscles':
               this.primaryMuscles.push(value)
               break;
            case 'secondaryMuscles':
               this.secondaryMuscles.push(value)
               break;
            case 'instructions':
               this.instructions.push(value)
               break;
            case 'category':
               this.category = value
               break;
            case 'images':
               this.images.push(value)
               break;
         }
      },
      changeData(key, value) {
         switch (key) {
            case 'name':
               this.name = key
               break;
            case 'force':
               this.force = value
               break;
            case 'level':
               this.level = value
               break;
            case 'mechanic':
               this.mechanic = value
               break;
            case 'equipment':
               this.equipment = value
               break;
            case 'primaryMuscles':
               this.primaryMuscles = value
               break;
            case 'secondaryMuscles':
               this.secondaryMuscles = value
               break;
            case 'instructions':
               this.instructions = value
               break;
            case 'category':
               this.category = value
               break;
            case 'images':
               this.images = value
               break;
         }
      }
   }
}
)

exerciseDataSchema.index({name : 'text'})

module.exports = mongoose.model('ExercisesData', exerciseDataSchema)