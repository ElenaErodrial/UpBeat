const { validate, errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')

module.exports = function (id, instru) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)
    
   

    return (async () => {
        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        totalInstruments = user.format.instruments

        if (!totalInstruments.includes(instru)) throw new NotFoundError(`${instru} not found`)

        let finalInstruments = totalInstruments.filter(instrument => instrument !== instru)

        user.format.instruments = finalInstruments

        await User.updateOne({_id:id},{format: user.format.instruments}) // aquí está el problema , transofrma format en un array. 
        
    })()
}