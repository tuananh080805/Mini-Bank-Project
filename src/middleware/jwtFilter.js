const jwt = require('jsonwebtoken')
const AppError = require("../utils/AppError")

const jwtFilter = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return new AppError('Token Not Found', 400)
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') return next(new AppError('Token Expired', 401))
            return next(new AppError('Token Invalid', 401))
        }
        req.user = decoded
        next()
    })
}
module.exports = jwtFilter