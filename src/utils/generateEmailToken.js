const crypto = require('crypto')

const generateEmailToken = () => {
    const token = crypto.randomBytes(32).toString('hex')
    return token
}
module.exports = generateEmailToken