const { validate, errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')

/**
* Toggle fav
* 
* @param {string} userId
* @param {string} favId
* 
*/

module.exports = function (userId, favId) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)
    validate.string(favId)
    validate.string.notVoid('favId', favId)
    if (!ObjectId.isValid(favId)) throw new ContentError(`${favId} is not a valid id`)

    return (async () => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)
        
        const favIndex = user.favs.indexOf(favId)

        if (favIndex === -1) {
            user.favs.push(favId)
        } else (
            user.favs.splice(favIndex, 1)
            )
        
        await user.save()
        
    })()
}