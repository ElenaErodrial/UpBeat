require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const addInstruments = require('.')
const { random } = Math
const { errors: { ContentError } } = require('upbeat-util')
const { database, models: { User, Solo } } = require('upbeat-data')


describe('logic - add instrument', () => {
    

    before(() => database.connect(TEST_DB_URL))

    let username, email, password, rol, rols, longitude, latitude, instruments, id, user
    rols = ['solo', 'groups']
    instrumentsList = ['drums', 'guitar', 'piano', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice']

    beforeEach(async () => {
        await User.deleteMany()

        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = rols[Math.floor(Math.random() * rols.length)]
        longitude = random()
        latitude = random()
        instruments = ['drums']
        format = new Solo({ instruments })
        
        user = await User.create({ username, email, password, rol, format, location: { coordinates: [latitude, longitude] } })
        id = user.id

    })

    it('should succeed on add instruments', async () => {
        const instru = ['guitar', 'flute']
        const response = await addInstruments(id, instru)
        expect(response).to.be.undefined
        const user = await User.findById(id)
        expect(user.format.instruments).to.include.members(instru)
        
    })

    it('should fail on not valid instruments', async () =>{
        const instru = ['wronginstrument']
        try {
            const response = await addInstruments(id, instru)
            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal(`${instru[0]} not valid`)
        }

        
    })


    after(() => User.deleteMany().then(database.disconnect))
})