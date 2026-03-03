const loginService = require("../services/loginService")
const { createUser } = require('../services/userService')

const createUserController = async (req, res, next) => {
    try {
        const data = req.body
        const result = await createUser(data)
        res.status(201).json({
            email: result.email,
            accountNumber: result.accountNumber
        })
    }
    catch (err) {
        next(err)
    }
}
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const token = await loginService({email,password})
        return res.status(200).json({
            token,
            message: 'Login Success'
        })
    }
    catch (err) {
        next(err)
    }
}
module.exports = {createUserController, loginController}