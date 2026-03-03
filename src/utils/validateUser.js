const validator = require('validator')
const isEmail = (email) => {
    return validator.isEmail(email)
}
const isFormatPassword = (password) => {
    return validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols:1
    })
}
const isPIN = (pin) => {
    return validator.isNumeric(pin) && validator.isLength(pin, {min:6,max:6})
}
module.exports = {isEmail, isFormatPassword, isPIN}