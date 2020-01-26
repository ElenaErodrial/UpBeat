const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const authenticateUser = require('.')
const { random } = Math
const { errors: { ContentError, CredentialsError } } = require('upbeat-util')
const { database, models: { User } } = require('upbeat-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, username, email, password, rol, rols, latitude, longitude, hash
    rols = ['solo','groups']

    beforeEach(async () => {
        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        hash = await bcrypt.hash(password , 10)
        rol = rols[Math.floor(Math.random()*rols.length)]
        longitude = random()
        latitude = random()
    

        await User.deleteMany()

        const user = await User.create({ username, email, password, rol, location: {coordinates: [latitude, longitude ]}, password: hash  })
        id = user.id
    })

    it('should succeed on correct credentials', async () => {
        const token = await authenticateUser(email, password)

        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(0)

        const [, payload,] = token.split('.')

        const { sub } = JSON.parse(atob(payload))

        expect(id).toBe(sub)
    })

    describe('when wrong credentials', () => {
        it('should fail on wrong email', async () => {
            const email = 'wrong'

            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(ContentError)

                const { message } = error
                expect(message).toBe(`wrong is not an e-mail`)
            }
        })

        it('should fail on wrong password', async () => {
            const password = 'wrong'

            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(CredentialsError)

                const { message } = error
                expect(message).toBe(`wrong credentials`)
            }
        })
    })

    it('should fail on incorrect email, password, or expression type and content', () => {
        expect(() => authenticateUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser([])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser('')).toThrow(ContentError, 'username is empty or blank')
        expect(() => authenticateUser(' \t\r')).toThrow(ContentError, 'username is empty or blank')

        expect(() => authenticateUser(email, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(email, true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser(email, [])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser(email, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(email, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(email, null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser(email, '')).toThrow(ContentError, 'password is empty or blank')
        expect(() => authenticateUser(email, ' \t\r')).toThrow(ContentError, 'password is empty or blank')
    })

   

    afterAll(() => User.deleteMany().then(database.disconnect))
})