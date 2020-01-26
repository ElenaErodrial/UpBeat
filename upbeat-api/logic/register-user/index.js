const { validate, errors: { ConflictError } } = require('upbeat-util')
const { models: { User, Solo, Groups } } = require('upbeat-data')
const bcrypt = require('bcryptjs')

/**
* Register user
* 
* @param {string} username
* @param {string} email 
* @param {string} password
* @param {string} rol
* @param {array} instruments 
* @param {string} groups
* @param {string} location
* 
* @throws {ConflictError} If exist another user with the same username.
* 
* @return {Promise}
* 
*/

module.exports = function (username, email, password, rol, instruments, groups, location) {
    validate.string(username)
    validate.string.notVoid('username', username)
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(password)
    validate.string.notVoid('password', password)
    validate.string(rol)
    validate.string.notVoid('rol', rol)
    validate.string(location)
    validate.string.notVoid('location', location)


    if (rol === 'solo') {
        validate.array(instruments)
        if (instruments.length === 0) throw new ContentError(`${instruments} can't be empty`)
        instruments.forEach(instrument =>
            validate.matches('instrument', instrument, 'drums', 'guitar', 'piano', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice')
        )
    }

    if (rol === 'groups') {

        validate.string(groups)
        validate.string.notVoid('groups', groups)
        validate.matches('groups', groups, 'band', 'choir', 'modernEnsemble', 'orchestra', 'classicChamber')
    }
  
  

    return (async () => {
        let user = await User.findOne({ username })

        if (user) throw new ConflictError(`user with username ${username} already exists`)

        
        const hash = await bcrypt.hash(password, 10)
        let format = {}

        if (rol === 'solo') {
            format = new Solo({ instruments })
        } else {
            format = new Groups({ groups })
        }

        user =  await User.create({ username, email, password: hash, rol, format, location })
        
        rol === 'solo' ? 
        user.image = `http://localhost:8000/data/users/default/solo.jpg` 
        : user.image = `http://localhost:8000/data/users/default/groups.jpg`
        
        await user.save()
    })()
}
