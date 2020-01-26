require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveMusician = require('.')
const { errors: { NotFoundError } } = require('upbeat-util')
const { database, models: { User, Solo, Groups } } = require('upbeat-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve musician', () => {
    before(() => database.connect(TEST_DB_URL))

    let username, email, password, rol, image, format, location, description, links, upcomings, id
    rols = ['solo', 'groups']
    instrumentsList = ['drums', 'guitar', 'piano', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice']
    groupsList = ['band', 'choir', 'modernEnsemble', 'orchestra', 'classicChamber']



    beforeEach(async () => {
        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = rols[Math.floor(Math.random() * rols.length)]
        longitude = random()
        latitude = random()
        instruments = [instrumentsList[Math.floor(Math.random() * instrumentsList.length)]]
        groups = groupsList[Math.floor(Math.random() * groupsList.length)]
        if (rol === 'solo') format = new Solo({ instruments })
        else format = new Groups({ groups })

    
        await User.deleteMany()

        const musician = await User.create({ username, email, password, image, rol,  format, location: { coordinates: [latitude, longitude] }, description, links, upcomings}) 
        id = musician.id
    })

        
    
    

    it('should succeed on correct user id', async () => {
        const musician = await retrieveMusician(id)
        expect(musician).to.exist
        expect(musician.id).to.equal(id)
        expect(musician.id).to.be.a('string')
        expect(musician._id).to.not.exist
        expect(musician.username).to.equal(username)
        expect(musician.username).to.be.a('string')
        expect(musician.email).to.equal(email)
        expect(musician.email).to.be.a('string')
        expect(musician.password).to.be.undefined
        expect(musician.rol).to.be.a('string')
        expect(musician.rol).to.equal(rol)
        musician.rol === 'solo' && expect(musician.format.instruments).to.eql(instruments)
        musician.rol === 'groups' && expect(musician.format.groups).to.equal(groups)
        expect(musician.location.coordinates).to.be.an('array')
    
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await retrieveMusician(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    after(() => User.deleteMany().then(database.disconnect))
})

