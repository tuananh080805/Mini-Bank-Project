const prisma = require('../config/connectDB')
const bcrypt = require('bcrypt')
const AppError = require("../utils/AppError")
const sendEmail = require("./sendEmail")
const generateEmailToken = require("../utils/generateEmailToken")
const { isEmail, isFormatPassword, isPIN } = require("../utils/validateUser")

const createUser = async (data) => {
    try {
        // kiem tra cac field va tao user
        const { email, password, pin } = data
        if (!email || !password || !pin) {
            throw new AppError("Invalid input",400)
        }
        if (!isEmail(email)) {
            throw new AppError("Invalid Email Format", 400)
        }
        if (!isPIN(pin)) {
            throw new AppError("Invalid PIN", 400)
        }
        if (!isFormatPassword(password)) {
            throw new AppError("Password must contain symbols, number, uppercase, lowercase, min length is 6",400)
        }
        // kiem tra user da ton tai chua
        const existingUser = await prisma.users.findUnique({ where: { email } })

        let token
        let accountNumber
        if (existingUser) {
            if (existingUser.is_verified) {
                throw new AppError('Email already exists!', 409)
            }
            token = generateEmailToken()
            const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
            await prisma.email_verifications.create({
                data: {
                    user_id: existingUser.id,
                    token: token,
                    expires_at: expiredAt
                }
            })
        }
        else {
            const passwordHash = await bcrypt.hash(password, 10)
            const pinHash = await bcrypt.hash(pin, 10)
            let userId
            const result = await prisma.$transaction(async (tx) => {
                const newUser = await tx.users.create({
                    data: {
                        email: email,
                        password_hash: passwordHash,
                        pin_hash: pinHash
                    }
                })
                userId = newUser.id
                const newAccount = await tx.bank_accounts.create({
                    data: {
                        user_id: newUser.id
                    }
                })
                //Thao tac tao token va tao email_verifications
                token = generateEmailToken()
                const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
                await tx.email_verifications.create({
                    data: {
                        user_id: userId,
                        token: token,
                        expires_at: expiredAt
                    }
                })
                return {
                    accountNumber: newAccount.account_number.toString(),
                    token
                }
            })
            token = result.token
            accountNumber = result.accountNumber
        }
        //Gui email cho nguoi dung
        const to = email
        const subject = 'Đăng kí thành công'
        const text = 'Vui lòng click vào link sau để kích hoạt tài khoản (hết hạn sau 24h): '
        const html = `
            <a href="http://${process.env.LOCAL_HOST}:3000/verify/email?token=${token}" 
            style="display:inline-block;
                    background-color:#2563eb;
                    color:#ffffff;
                    padding:12px 24px;
                    font-size:16px;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;">
                Xác nhận tài khoản
            </a>
        `
        await sendEmail({to,subject,text,html})
        return {
            email: email,
            accountNumber: accountNumber
        }
    }
    catch (err) {
        // giu nguyen AppError
        console.log(err.message)
        if(err instanceof AppError) throw err
        if (err.code === 'P2002') {
            throw new AppError('Email already exists!',409)
        }
        throw new AppError("Create account failed", 500)
    }
}

module.exports = { createUser }