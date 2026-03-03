const depositService = require("../services/depositService")
const transferService = require("../services/transferService")
const withdrawService = require("../services/withdrawService")

const withdrawController = async (req, res, next) => {
    try {
        const userId = req.user.id 
        const { pin, amount } = req.body 
        const balance = await withdrawService({ pin, userId }, Number(amount))
        res.status(200).json({
            message: 'Withdraw Success',
            balance
        })
    }
    catch (err) {
        next(err)
    }
}

const depositController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { amount } = req.body
        const balance = await depositService({ userId, amount })
        res.status(200).json({
            message: 'Deposit Success',
            balance
        })
    }
    catch (err) {
        next(err)
    }
}

const transferController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { toAccountNumber, amount, pin } = req.body
        const balance = await transferService(userId, toAccountNumber, amount, pin)
        return res.status(200).json({
            message: 'Transfer Success',
            balance
        })
    }
    catch (err) {
        next(err)
    }
}

module.exports = {withdrawController, depositController, transferController}