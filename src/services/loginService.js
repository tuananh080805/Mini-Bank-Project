const AppError = require("../utils/AppError")
const bcrypt = require('bcrypt')
const prisma = require('../config/connectDB')
const { generateToken } = require("../utils/generateToken")
const { isEmail } = require("../utils/validateUser")

const loginService = async ({email, password}) => {
    try {
        if(!isEmail(email)) throw new AppError('Invalid Email Format', 400)
        const user = await prisma.users.findUnique({
            where:{email}
        })
        if (!user) throw new AppError('User Not Found', 404)
        if (!user.is_verified) throw new AppError('Account Not Active', 400)
        const check = await bcrypt.compare(password, user.password_hash)
        if (!check) throw new AppError('Wrong Password', 401)
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = generateToken(payload)
        return token
    }
    catch (err) {
        console.log(err.message)
        if (err instanceof AppError) throw err
        throw new AppError('Login Failed', 500)
    }
}
module.exports = loginService