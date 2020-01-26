const { ObjectId, models: { Chat, User, Message } } = require('upbeat-data')
const { validate, errors: { ContentError, NotFoundError } } = require('upbeat-util')


module.exports = function(chatId, userId, body) {
    validate.string(chatId)
    validate.string.notVoid('chatId', chatId)
    if (!ObjectId.isValid(chatId)) throw new ContentError(`${chatId} is not a valid id`)

    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(body)
    validate.string.notVoid('body', body)

    return (async() => {

        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const chat = await Chat.findById(chatId)
        if (!chat) throw new NotFoundError(`chat with id ${chatId} not found`)

        const message = new Message({ user: userId, body, date: new Date })
        chat.messages.push(message)
        await chat.save()

        return message.id
    })()
}