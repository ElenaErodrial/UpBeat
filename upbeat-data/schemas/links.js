const {Schema} = require('mongoose')

module.exports = new Schema({
name: {
    type: String,
    enum: ['blog', 'instagram', 'website', 'youtube', 'soundcloud', 'spotify']
},
url: {
    type: String
}

})