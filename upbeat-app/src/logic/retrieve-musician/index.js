const call = require('../../utils/call')
const { validate, errors: { NotFoundError } } = require('upbeat-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL
//const API_URL = "http://localhost:8000"

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)


    return (async () => {
        const res = await call(`${API_URL}/users/detail/${id}`, {
            method: 'GET',
        })
        if (res.status === 201) {

            const musician = JSON.parse(res.body)

            return musician

        }
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)


    })()
}


