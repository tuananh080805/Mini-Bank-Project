const AppError = require("../utils/AppError")
const prisma = require('../config/connectDB')

const getAccountNumber = async (userId) => {
    try {
        const userAccount = await prisma.bank_accounts.findUnique({
            where:{user_id: userId}
        })
        if (!userAccount) throw new AppError('Account Not Found', 404)
        return userAccount.account_number.toString()
    }
    catch (err) {
        if (err instanceof AppError) throw err
        throw new AppError('Can Not Get AccountNumber', 500)
    }
}
module.exports = getAccountNumber