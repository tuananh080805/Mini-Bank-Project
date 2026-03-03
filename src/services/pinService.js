const prisma = require('../config/connectDB')
const bcrypt = require('bcrypt')
const AppError = require("../utils/AppError")

const checkPIN = async (pin, userId) => {
    try {
        const user = await prisma.users.findUnique({
            where:{id: userId}
        })
        if (!user) throw new AppError('User Not Found', 404)
        if (user.is_pin_locked) throw new AppError('Account is locked', 423)
        const check = await bcrypt.compare(String(pin), user.pin_hash)
        if (!check) {
            if (user.failed_pin_attempts + 1 >= 3) {
                await prisma.users.update({
                    where: { id: userId },
                    data: {
                        is_pin_locked: true,
                        failed_pin_attempts: user.failed_pin_attempts + 1
                    }
                })
            }
            else {
                await prisma.users.update({
                    where: { id: userId },
                    data: {
                        failed_pin_attempts: user.failed_pin_attempts + 1
                    }
                })
            }
            return false
        }
        await prisma.users.update({
            where: { id: userId },
            data: {
                failed_pin_attempts: 0
            }
        })
        return true
    }
    catch (err) {
        console.log(err.message)
        if (err instanceof AppError) throw err
        throw new AppError('Can Not Check PIN', 500)
    }
}
module.exports = {checkPIN}