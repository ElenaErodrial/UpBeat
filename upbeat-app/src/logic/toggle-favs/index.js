const call = require('../../utils/call')
const { validate, errors: { NotFoundError } } = require('upbeat-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL
//const API_URL = "http://localhost:8000"




module.exports = function (token, favId) {
    validate.string(token)
    validate.string.notVoid('token', token)
    validate.string(favId)
    validate.string.notVoid('favId', favId)

   
	return (async () => {
        const res = await call(`${API_URL}/users/favs/${favId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.status === 200) return
        
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}