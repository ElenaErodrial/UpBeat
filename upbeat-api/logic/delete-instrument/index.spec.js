require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const deleteInstrument = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError }, polyfills: { arrayRandom } } = require('upbeat-util')
const { database, ObjectId, models: { User, Solo } } = require('upbeat-data')



describe('logic - delete instrument', () => {

    before(() => database.connect(TEST_DB_URL))

    let username, email, password, rol, rols, longitude, latitude, instruments, id

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
        instruments = ['drums', 'trumpet', 'violin']
        format = new Solo({ instruments })

        const user = await User.create({ username, email, password, rol, format, location: { coordinates: [latitude, longitude] } })
        id = user.id

    
        }   
    )

    it('should succeed on correct delete instrument', async () => {
        const instru = instruments[Math.floor(Math.random() * instruments.length)]
        const response = await deleteInstrument(id, instru)
        expect(response).to.be.undefined
        const user = await User.findById(id)
        expect(user.format).to.not.contain(instru)
        
    })

    it('should fail on unexisting user and correct delete instrument', async () => {
        const id = ObjectId().toString()
        const instru = instruments[Math.floor(Math.random() * instruments.length)]
  
        try {
            await deleteInstrument(id, instru)

            throw new Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
           expect(error.message).to.equal(`user with id ${id} not found`)
        } 

    })

    it('should fail on correct user and unexisting task data', async () => {
        const instru = `instru-${random()}`
        try {
            await deleteInstrument(id, instru)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`${instru} not found`)
        }
    })

    after(() => User.deleteMany().then(database.disconnect))
})
