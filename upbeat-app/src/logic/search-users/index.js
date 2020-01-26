const call = require('../../utils/call')
const { validate, errors: { NotFoundError } } = require('upbeat-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL
//const API_URL = "http://localhost:8000"

module.exports = function (query) {
    validate.string(query)
    validate.string.notVoid('query', query)
    // query = query.toLowerCase()
	return (async () => {
        const res = await call(`${API_URL}/users/search/${query}`, {
            method: 'GET'
        })

        if (res.status === 201) {

            const {results} = JSON.parse(res.body) 

            return results
        }
        
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}