const prisma = require('../config/connectDB')
const AppError = require("../utils/AppError")
const redis = require('../config/redis')

const getBalanceService = async (userId) => {
    try {
        const balanceRedis = await redis.get(`balance:${userId}`)
        if (!balanceRedis) {
            const userAccount = await prisma.bank_accounts.findUnique({
                where: {user_id: userId}
            })
            if(!userAccount) throw new AppError('Account Not Found', 404)
            await redis.set(`balance:${userId}`,userAccount.balance.toString(),{EX: 60})
            return userAccount.balance
        }
        return balanceRedis
    }
    catch (err) {
        console.log(err.message)
        if (err instanceof AppError) throw err
        throw new AppError('Can not get balance', 500)
    }
}
module.exports = getBalanceService