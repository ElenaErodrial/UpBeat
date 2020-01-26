
const { ObjectId, models: { Chat } } = require('upbeat-data')
const { validate, errors: { ContentError, NotFoundError } } = require('upbeat-util')


module.exports = function(chatId) {
    validate.string(chatId)
    validate.string.notVoid('chatId', chatId)
    if (!ObjectId.isValid(chatId)) throw new ContentError(`${chatId} is not a valid id`)

    return (async() => {
        const chat = await Chat.findById(chatId)
        if (!chat) throw new NotFoundError(`chat with id ${chatId} not found`)

        return chat.messages


    })()
}