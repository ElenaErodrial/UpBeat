const { validate, errors: { CredentialsError } } = require('upbeat-util')
const { models: { User } } = require('upbeat-data')
const bcrypt = require('bcryptjs')

/**
* Authenticate user
* 
* @param {string} email
* @param {string} password
* 
* @throws {CredentialsError} If username or password doesn't match with the correct credentials
* 
* @return {Promise}
* @return {string}  Returns the user id
*/

module.exports = function (email, password) {
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(password)
    validate.string.notVoid('password', password)

    return (async () => {
        const user = await User.findOne({ email })

        if (!user || !(await bcrypt.compare(password, user.password))) throw new CredentialsError('wrong credentials')

        user.lastAccess = new Date

        await user.save()

        return user.id
    })()
}
