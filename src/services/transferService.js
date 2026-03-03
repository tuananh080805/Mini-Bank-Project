const prisma = require('../config/connectDB')
const AppError = require("../utils/AppError")
const redis = require('../config/redis')
const { checkPIN } = require("./pinService")

const transferService = async (userId, toAccountNumber, amount, pin) => {
    try {
        let fromAccountBalance, toAccountBalance
        if (amount <= 0) throw new AppError('Invalid amount', 400)
        const check = await checkPIN(pin, userId)
        if (!check) throw new AppError('Wrong PIN', 400)
        await prisma.$transaction(async (tx) => {
            const fromAccount = await tx.bank_accounts.findUnique({
                where: {user_id: userId}
            })
            if(Number(fromAccount.balance) < Number(amount)) throw new AppError('Balance Not Enough', 400)
            const toAccount = await tx.bank_accounts.findUnique({
                where: { account_number: toAccountNumber }
            })
            if (!toAccount) throw new AppError('Recipient Account Not Found', 404)
            if (fromAccount.id === toAccount.id) throw new AppError('Cannot transfer to yourself', 400)
            const result1 = await tx.bank_accounts.update({
                where: { id: fromAccount.id },
                data: {
                    balance:{decrement: amount}
                }
            })
            const result2 = await tx.bank_accounts.update({
                where: { id: toAccount.id },
                data: {
                    balance:{increment: amount}
                }
            })
            fromAccountBalance = result1.balance
            toAccountBalance = result2.balance
        })
        await redis.del(`balance:${userId}`)
        await redis.set(`balance:${userId}`, fromAccountBalance.toString(), {EX:60})
        return fromAccountBalance
    }
    catch (err) {
        console.log(err.message)
        if (err instanceof AppError) throw err
        throw new AppError('Transfer Wrong', 500)
    }
}
module.exports = transferService