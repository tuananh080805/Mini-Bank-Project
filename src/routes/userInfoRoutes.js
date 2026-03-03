const express = require('express')
const { getBalanceController, getAccountNumberController } = require("../controllers/accountController")
const jwtFilter = require("../middleware/jwtFilter")
const router = express.Router()

router.get('/balance',jwtFilter ,getBalanceController)
router.get('/account-number',jwtFilter ,getAccountNumberController)

module.exports = router