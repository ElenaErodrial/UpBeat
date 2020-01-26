const call = require('../../utils/call')
const { validate, errors: { NotFoundError } } = require('upbeat-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL
//const API_URL = "http://localhost:8000"

module.exports = function (token) {
    validate.string(token)
    validate.string.notVoid('token', token)
   

	return (async () => {
        const res = await call(`${API_URL}/users/favs`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },

        })

        if (res.status === 200) {

            const favs = JSON.parse(res.body) 

            return favs
        }
        
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}