const AppError = require("../utils/AppError")
const prisma = require('../config/connectDB')
const redis = require('../config/redis')

const depositService = async ({userId, amount}) => {
    try {
        const userAccount = await prisma.bank_accounts.update({
            where: { user_id: userId },
            data: {
                balance: {increment: amount}
            }
        })
        await redis.del(`balance:${userId}`)
        return userAccount.balance
    }
    catch(err) {
        if(err instanceof AppError) throw err
        throw new AppError('Can Not Deposit', 500)
    }
}
module.exports = depositService