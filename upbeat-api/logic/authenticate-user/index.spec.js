require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const authenticateUser = require('.')
const { random } = Math
const { errors: { ContentError, CredentialsError } } = require('upbeat-util')
const { database, models: { User } } = require('upbeat-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, username, email, password, rol, rols, location, hash
    rols = ['solo','groups']

    beforeEach(async () => {
        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password , 10)
        rol = rols[Math.floor(Math.random()*rols.length)]
        location = `location-${random()}`
    

        await User.deleteMany()

        const user = await User.create({ username, email, password: hash, rol, location })
        id = user.id
    })

    it('should succeed on correct credentials', async () => {
        const userId = await authenticateUser(email, password)

        expect(userId).to.exist
        expect(typeof userId).to.equal('string')
        expect(userId.length).to.be.greaterThan(0)

        expect(userId).to.equal(id)
    })

    describe('when wrong credentials', () => {
        it('should fail on wrong email', async () => {
            const email = 'wrong@git.es'

            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)

                const { message } = error
                expect(message).to.equal('wrong credentials')
            }
        })

        it('should fail on wrong password', async () => {
            const password = 'wrong'

            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)

                const { message } = error
                expect(message).to.equal('wrong credentials')
            }
        })
    })

    it('should fail on incorrect email, password, or expression type and content', () => {
        expect(() => authenticateUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => authenticateUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => authenticateUser([])).to.throw(TypeError, ' is not a string')
        expect(() => authenticateUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(null)).to.throw(TypeError, 'null is not a string')

        expect(() => authenticateUser('')).to.throw(ContentError, 'e-mail is empty or blank')
        expect(() => authenticateUser(' \t\r')).to.throw(ContentError, 'e-mail is empty or blank')

        expect(() => authenticateUser(email, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => authenticateUser(email, true)).to.throw(TypeError, 'true is not a string')
        expect(() => authenticateUser(email, [])).to.throw(TypeError, ' is not a string')
        expect(() => authenticateUser(email, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(email, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(email, null)).to.throw(TypeError, 'null is not a string')

        expect(() => authenticateUser(email, '')).to.throw(ContentError, 'password is empty or blank')
        expect(() => authenticateUser(email, ' \t\r')).to.throw(ContentError, 'password is empty or blank')
    })

    // TODO other cases

    after(() => User.deleteMany().then(database.disconnect))
})
