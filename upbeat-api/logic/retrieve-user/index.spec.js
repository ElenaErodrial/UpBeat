require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveUser = require('.')
const { errors: { NotFoundError } } = require('upbeat-util')
const { database, models: { User, Solo, Groups } } = require('upbeat-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve user', () => {
    before(() => database.connect(TEST_DB_URL))

    let id , username, email, password, rol, rols, location, format
    rols = ['solo', 'groups']
    instrumentsList = ['drums', 'guitar', 'piano', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice']
    groupsList = ['band', 'choir', 'modernEnsemble', 'orchestra', 'classicChamber']



    beforeEach(async () => {
        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = rols[Math.floor(Math.random() * rols.length)]
        location = `location-${random()}`
        instruments = [instrumentsList[Math.floor(Math.random() * instrumentsList.length)]]
        groups = groupsList[Math.floor(Math.random() * groupsList.length)]
        if (rol === 'solo') format = new Solo({ instruments })
        else format = new Groups({ groups })

        hash = await bcrypt.hash(password, 10)

        await User.deleteMany()

        const user = await User.create({ username, email, password, rol, format, location })

        id = user.id
    })

    it('should succeed on correct user id', async () => {
        const user = await retrieveUser(id)
        expect(user).to.exist
        expect(user.id).to.equal(id)
        expect(user.id).to.be.a('string')
        expect(user._id).to.not.exist
        expect(user.username).to.equal(username)
        expect(user.username).to.be.a('string')
        expect(user.email).to.equal(email)
        expect(user.email).to.be.a('string')
        expect(user.password).to.be.undefined
        expect(user.rol).to.be.a('string')
        expect(user.rol).to.equal(rol)
        user.rol === 'solo' && expect(user.format.instruments).to.eql(instruments)
        user.rol === 'groups' && expect(user.format.groups).to.equal(groups)
        expect(user.location).to.be.a('string')
    
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await retrieveUser(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    // TODO other cases

    after(() => User.deleteMany().then(database.disconnect))
})
