const verifyUser = require("../services/verifyUser")

const verifyUserController = async (req, res, next) => {
    try {
        const { token } = req.query
        await verifyUser(token)
        return res.status(200).json({
            message: 'Account Active'
        })
    }
    catch (err) {
        next(err)
    }
}
module.exports = verifyUserController