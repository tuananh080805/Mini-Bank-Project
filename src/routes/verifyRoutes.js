const express = require('express')
const verifyUserController = require("../controllers/verifyUserController")
const router = express.Router()

router.get('/email', verifyUserController)

module.exports = router