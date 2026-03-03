const express = require('express')
const { createUserController, loginController } = require("../controllers/userController")
const router = express.Router()

router.post('/create', createUserController)
router.post('/login', loginController)

module.exports = router