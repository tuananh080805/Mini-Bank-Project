const prisma = require('../config/connectDB')
const AppError = require("../utils/AppError")

const verifyUser = async (token) => {
    try {
        const userToken = await prisma.email_verifications.findUnique({
            where: {token : token}
        })
        if (!userToken) throw new AppError('Token Not Found', 404)
        if (userToken.used) throw new AppError('Token used', 400)
        const now = new Date()
        if (userToken.expires_at < now) throw new AppError('Token expired', 400)
        const user = await prisma.users.findUnique({
            where:{id : userToken.user_id}
        })
        if (!user) throw new AppError('User Not Found', 404)
        await prisma.$transaction(async (tx) => {
            await tx.users.update({
                where: { id: userToken.user_id },
                data: { is_verified: true, updated_at: new Date() }
            })
            await tx.email_verifications.update({
                where: { token },
                data: {used : true}
            })
        })
    }
    catch (err) {
        if (err instanceof AppError) throw err
        throw new AppError('Verify Fail', 500)
    }
}
module.exports = verifyUser