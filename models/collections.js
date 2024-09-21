const mongoose = require("mongoose")

const plansSchema = new mongoose.Schema({
	exercises: {
		type: [String],
		required: true
	}
}, {
	methods: {

	}
})


module.exports = mongoose.model('Collections', cllectionSchema)