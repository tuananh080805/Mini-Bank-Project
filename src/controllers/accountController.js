const getBalanceService = require("../services/getBalanceService")
const getAccountNumber = require("../services/getAccountNumber")


const getBalanceController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const balance = await getBalanceService(userId)
        return res.status(200).json({
            message: 'Get balance success',
            balance
        })
    }
    catch (err) {
        next(err)
    }
}

const getAccountNumberController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const userAccountNumber = await getAccountNumber(userId)
        return res.status(200).json({
            message: 'Get Account Number Success',
            userAccountNumber
        })
    }
    catch (err) {
        next(err)
    }
}

module.exports = {getBalanceController, getAccountNumberController}