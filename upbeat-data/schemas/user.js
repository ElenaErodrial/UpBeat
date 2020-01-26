const {Schema, ObjectId} = require('mongoose')
// const Links = require('./links')
const { validators: { isEmail } } = require('upbeat-util')

module.exports = new Schema ({
    username: {
        type: String,
        required: true,    
    },

    email: {
        type: String,
        required: true,
        validate: isEmail,
        unique: true
    },
    
    password: {
        type: String,
        required: true,

    },

    image: {
        type: String,
    },

    rol: {
        type: String,
        enum: ['solo', 'groups']
    },

    format: {
        type: Object
    },
   
    description: {
        type: String
    },

    upcomings: {
        type: String
    },

    links : {
        type: String
    },

    favs: {
        type: [ObjectId],
        ref: 'User'
    },

    location: {
        type: String 
    }
   
})