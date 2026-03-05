const prisma = require('../config/connectDB')
const AppError = require("../utils/AppError")
const redis = require('../config/redis')

const getHistory = async (userId) => {
    try {
        const historyRedis = await redis.get(`history-transaction:${userId}`)
        if (!historyRedis) {
            
            const account = await prisma.bank_accounts.findUnique({
                where: {user_id:userId}
            })
            if(!account) throw new AppError('Account User Not Found', 404)
            const result = await prisma.transactions.findMany({
                take: 5,
                where: {
                    OR: [
                        { from_account_id: account.id },
                        { to_account_id: account.id}
    
                    ]
                },
                include: {
                    bank_accounts_transactions_from_account_idTobank_accounts: {
                        select: {
                            account_number: true,
                            users: {
                                select: {
                                    email: true
                                }
                            }
                        }
                    },
                    bank_accounts_transactions_to_account_idTobank_accounts: {
                        select: {
                            account_number: true,
                            users: {
                                select: {
                                    email: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            })
            const history = result.map((data) => ({
                reference: data.reference_number?.toString(),
                fromAccount: data.bank_accounts_transactions_from_account_idTobank_accounts ?.account_number?.toString() || null,
                fromUser: data.bank_accounts_transactions_from_account_idTobank_accounts?.users?.email || null,
                toAccount: data.bank_accounts_transactions_to_account_idTobank_accounts?.account_number?.toString() || null,
                toUser: data.bank_accounts_transactions_to_account_idTobank_accounts?.users?.email || null,
                amount: data.amount?.toString(),
                type: data.type,
                status: data.status,
                description: data.description,
                createdAt: data.created_at
            }))
            await redis.set(`history-transaction:${userId}`, JSON.stringify(history), { EX: 60 })
            return history
        }
        const history = JSON.parse(historyRedis)
        return history
    }
    catch (err) {
        console.log(err.message)
        if (err instanceof AppError) throw err
        throw new AppError('Can Not Get History', 500)
    }
}
module.exports = {getHistory}