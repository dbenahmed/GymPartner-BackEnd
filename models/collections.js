const mongoose = require("mongoose")

const cllectionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	plans: {
		type: [
			{
				name: {
					type: String,
					required: true
				},
				exercises: {
					type: [String],
					required: true
				}
			}
		]
	},
}, {
	methods: {

	}
})


module.exports = mongoose.model('Collections', cllectionSchema)