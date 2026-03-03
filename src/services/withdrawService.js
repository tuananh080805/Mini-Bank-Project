const prisma = require('../config/connectDB')
const AppError = require("../utils/AppError")
const { checkPIN } = require("./pinService")
const redis = require('../config/redis')

const withdrawService = async ({pin,userId}, amount) => {
    try {
        if(amount <= 0 || amount > 20000000) throw new AppError('Amount must be between 0 and 20000000',400)
        const check = await checkPIN(pin, userId)
        if (!check) throw new AppError('Wrong PIN', 400)
        let balance
        await prisma.$transaction(async (tx) => {
            const userAccount = await prisma.bank_accounts.findUnique({ where: { user_id: userId } })
            if (!userAccount) throw new AppError('Account Not Found', 404)
            if (userAccount.balance < amount) throw new AppError('Not Enough Balance', 400)
            await tx.transactions.create({
                data: {
                    from_account_id: userAccount.id,
                    amount: amount,
                    type: 'WITHDRAWAL',
                    status: 'SUCCESS'
                }
            })
            const result = await tx.bank_accounts.update({
                where: { id: userAccount.id },
                data: {
                    balance: {decrement: amount}
                }
            })
            balance = result.balance
        })
        await redis.del(`balance:${userId}`)
        return balance
    }
    catch (err) {
        if (err instanceof AppError) throw err
        throw new AppError('Withdraw Failed', 500)
    }
}
module.exports = withdrawService