const call = require('../../utils/call')
const { validate, errors: { CredentialsError } } = require('upbeat-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL
//const API_URL = "http://localhost:8000"

/**
* Authenticate user
* 
* @param {string} email
* @param {string} password
* 
* @throws {CredentialsError} If username or password doesn't match with the correct credentials
* 
* @return {Promise}
* @return {string}  id Returns the user id
*/

module.exports = function (email, password) {
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(password)
    validate.string.notVoid('password', password)

	return (async () => {
        const res = await call(`${API_URL}/users/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

		if (res.status === 200) return JSON.parse(res.body).token
        
        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}