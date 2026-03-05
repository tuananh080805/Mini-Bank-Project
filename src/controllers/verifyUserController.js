const verifyUser = require("../services/verifyUser")

const verifyUserController = async (req, res, next) => {
    try {
        const { token } = req.query
        await verifyUser(token)
        return res.redirect("https://mini-bank-project-fe.vercel.app/login")
    }
    catch (err) {
        next(err)
    }
}
module.exports = verifyUserController