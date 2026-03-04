const prisma = require("../../src/config/connectDB")
const depositService = require('../../src/services/depositService')
const redis = require('../../src/config/redis')

jest.mock('../../src/config/connectDB.js', () => ({
    $transaction: jest.fn()
}))

jest.mock('../../src/config/redis.js', () => ({
    del: jest.fn()
}))

describe('Test deposit', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    it('Success',async () => {
        const fakeTX = {
            bank_accounts: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 1,
                    balance: 10000
                }),
                update: jest.fn().mockResolvedValue({
                    balance: 15000
                })
            },
            transactions: {
                create: jest.fn().mockResolvedValue({})
            }
        }
        prisma.$transaction.mockImplementation(async (callback) => {
            return callback(fakeTX)
        })
        const result = await depositService({userId:1,amount:5000})
        expect(result).toBe(15000)
        expect(redis.del).toHaveBeenCalledTimes(2)
    })  
    it('Invalid Amount', async () => {
        await expect(depositService({ userId: 1, amount: 0 })).rejects.toThrow('Invalid Amount')
    })
    it('Account Not Found', async () => {
        const fakeTX = {
            bank_accounts: {
                findUnique: jest.fn().mockResolvedValue(null)
            }
        }
        prisma.$transaction.mockImplementation((callback) => {
            return callback(fakeTX)
        })
        await expect(depositService({ userId: 10, amount: 10000 })).rejects.toThrow('Account Not Found')
    })
})