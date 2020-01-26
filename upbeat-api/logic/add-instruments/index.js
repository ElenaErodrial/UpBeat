const { validate, errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')
instrumentsList = ['drums', 'guitar', 'piano', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice']

module.exports = function (id, instru) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)
    validate.array(instru)
     

    return (async () => {
        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        instru.forEach(ele => {
            if (!instrumentsList.includes(ele)) throw new ContentError(`${instru} not valid`)
            else {
                if (!user.format.instruments.includes(ele))
                {user.format.instruments.push(ele)}
            }
            
        })


        await User.updateOne({ _id: id }, { format: user.format })

    })()
}