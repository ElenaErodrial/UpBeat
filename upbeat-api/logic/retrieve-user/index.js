const { validate, errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')
const bcrypt = require('bcryptjs')

/**
* Retrieve user
* 
* @param {string} id
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the user with the id
* 
* @return {Promise}
* @return {Object} Returns the complete user
*/

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        user.lastAccess = new Date

        await user.save()

        const { username, email, rol, format, location, description, image, upcomings, favs , links} = user.toObject()
        
        return {  id, username, email, rol, format, location, description, image, upcomings, favs , links}
        
    })()
}
