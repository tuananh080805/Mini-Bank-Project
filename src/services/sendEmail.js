const transporter = require("../config/mailSender")

const sendEmail = async ({ to, subject, text, html }) => {
    const objectSender = {
        from: `My App <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    }

    await transporter.sendMail(objectSender)
}

module.exports = sendEmail