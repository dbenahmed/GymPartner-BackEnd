const express = require("express")

const auth = express.Router()

auth.get('/', (req, res) => {
   res.send("done")
})


module.exports = { auth }