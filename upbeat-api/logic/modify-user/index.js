const { validate, errors: { ConflictError, NotFoundError } } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')



/**
* modify user
* 
* @param {string} id
* @param {string} username
* @param {string} email
* @param {string} password 
* @param {string} description 
* @param {string} image 
* @param {string} links
* @param {string} upcomings 
* @param {string} location 
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the user with the id
* 
* @return {Promise}
*/

module.exports = function (id, username, email, password, description, image, links, upcomings, location ) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    if (username) {
        validate.string(username)
        validate.string.notVoid('username', username)
    }
    if (email) {
        validate.string(email)
        validate.string.notVoid('e-mail', email)
    }
    if (password) {validate.string(password)
        validate.string.notVoid('password', password)}
    

    if (description) {
        validate.string(description)
        validate.string.notVoid('description', description)
    }
    if (image) {
        validate.string(image)
        validate.string.notVoid('image', image)
    }
    if (links) {
        validate.string(links)
        validate.string.notVoid('links', links)
       
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
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const update = {}

        username && (update.username = username)
        email && (update.email = email)
        password && (update.password = password)
        description && (update.description = description)
        image && (update.image = image)
        links && (update.links = links)
        upcomings && (update.upcomings = upcomings)
        location && (update.location = location)

        await User.updateOne({ _id: ObjectId(id) }, { $set: update })
    })()
}
