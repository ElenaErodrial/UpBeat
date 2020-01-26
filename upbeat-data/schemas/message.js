const { Schema } = require('mongoose')
const { ObjectId } = require('mongodb')

module.exports = new Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },

    content: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    }

})