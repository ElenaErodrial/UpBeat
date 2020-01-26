const {Schema} = require('mongoose')

module.exports = new Schema ({
    groups: {
        type: String,
        enum: ['band', 'choir', 'modernEnsemble', 'orchestra', 'classicChamber'],
        require: true
    }
})