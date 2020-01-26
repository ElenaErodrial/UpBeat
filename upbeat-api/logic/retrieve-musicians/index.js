const { validate, errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')

/**
* retrieve musicians
* 
* @param {string} id
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the user with the id
* 
* @return {Object} Array that contains all the data of the favorites.
*/

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const musician = await User.findById(id)

        if (!musician) throw new NotFoundError(`user with id ${id} not found`)


        const { username, email, image, rol, format, location, description, links, upcomings, _id} = musician
        
            return { username, email, image, rol, format, location, description, links, upcomings, id : _id.toString()}

    })()
}
