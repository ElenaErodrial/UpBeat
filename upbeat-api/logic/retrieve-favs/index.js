const { validate, errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')

/**
* retrieve favs
* 
* @param {string} id
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the user with the id
* 
* @return {Array} Array that contains all the data of the favorites.
*/

module.exports = function (id) {
    
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const user = await User.findById(id).populate('favs')

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const { favs } = user

        result = favs.map((fav) => {
            const { id, username, email, rol, image, format, location, description, links, upcomings} = fav
            return { id, username, email, rol, image, format, location, description, links, upcomings }
        })

        return result

    })()
}