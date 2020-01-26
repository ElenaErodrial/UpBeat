const { model } = require('mongoose')
const { user, chat, message, links, solo, groups } = require('./schemas')

module.exports = {
    User: model('User', user),
    Chat: model('Chat', chat),
    Message: model('Message', message),
    Links: model('Links', links),
    Solo: model('solo', solo),
    Groups: model('groups', groups)
}