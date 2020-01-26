const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const registerUser = require('.')
const { random } = Math
const { errors: { ContentError } } = require('upbeat-util')
const { database, models: { User } } = require('upbeat-data')

describe('logic - register user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let username, email, password, rol, groups, instruments

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        return User.deleteMany()
    })

    it('should succeed on correct credentials', async () => {
        const response = await registerUser(name, surname, email, username, password)

        expect(response).toBeUndefined()

        const user = await User.findOne({ username })

        expect(user).toBeDefined()

        expect(user.name).toBe(name)
        expect(user.surname).toBe(surname)
        expect(user.email).toBe(email)
        expect(user.username).toBe(username)
        expect(user.password).toBe(password)
    })

    describe('when user already exists', () => {
        beforeEach(() => User.create({ name, surname, email, username, password }))

        it('should fail on already existing user', async () => {
            try {
                await registerUser(name, surname, email, username, password)

                throw Error('should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()

                expect(error.message).toBeDefined()
                expect(typeof error.message).toBe('string')
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toBe(`user with username ${username} already exists`)
            }
        })
    })