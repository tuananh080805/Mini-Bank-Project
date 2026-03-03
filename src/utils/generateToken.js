const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '30m'})
}

const generateTokenRefresh = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'})
}

module.exports = {generateToken,generateTokenRefresh}