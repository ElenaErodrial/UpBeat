const {Schema} = require('mongoose')

module.exports = new Schema ({
instruments: [{
    type: String,
    enum: ['drums', 'guitar', 'piano', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice'],
    require: true
}]

})