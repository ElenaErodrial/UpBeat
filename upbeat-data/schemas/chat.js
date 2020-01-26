//Schema for one single chat conversation with one u ser, users will take both users (me and the other)
//messages will take all the messages written in the conversation, (see Message schema)

const {Schema} = require('mongoose')
const Message = require('./message') // me traigo el esquema de message, ya que va embebido. 

module.exports = new Schema ({
users : {
    type: Array
},

messages : [Message]

})