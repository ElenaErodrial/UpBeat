const call = require('../../utils/call')
const { validate, errors: {  NotFoundError, ConflictError } } = require('upbeat-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL

module.exports = function (id, token, username, email, description, upcomings, location, links) {
    validate.string(token)
    validate.string.notVoid('token', token)


    if (username) {
        validate.string(username)
        validate.string.notVoid('username', username)
    }
    if (email) {
        validate.string(email)
        validate.string.notVoid('e-mail', email)
    }
  
    if (description) {
        validate.string(description)
        validate.string.notVoid('description', description)
    }

    if (upcomings) {
        validate.string(upcomings)
        validate.string.notVoid('upcomings', upcomings)
    }

    if (location) {
        validate.string(location)
        validate.string.notVoid('location', location)
    }


    return (async () => {
        const res = await call(`${API_URL}/users/profile`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, description, upcomings, location, links })
        })

        if (res.status === 200) return

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)



    })()
}
