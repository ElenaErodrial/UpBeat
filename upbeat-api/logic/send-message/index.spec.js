require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const sendMessage = require('.')
const { errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, database, models: { User, Chat } } = require('upbeat-data')

describe('logic - sendMessage', () => {
    before(() => database.connect(TEST_DB_URL))

    let id1, chatId, username, email, password, body


    beforeEach(async() => {
        await User.deleteMany()

        //PERSON
        username = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        //rol = 'PERSON'

        body = `body-${random()}`

        const user1 = await User.create({ username, email, password })
        id1 = user1.id


        const chat = await Chat.create({ users: [ObjectId(id1)], messages: [] })
        chatId = chat.id
    })

    it('should return a correct chat', async() => {
        const messageId = await sendMessage(chatId, id1, body)

        const chat = await Chat.findById(chatId)

        chat.messages.forEach(element => {
            if (element.id === messageId) {
                expect(element).to.exist
                expect(element.id).to.equal(messageId)
                expect(element.user.toString()).to.equal(id1)
                expect(element.body).to.equal(body)
            }
        })
    })

    it('should throw an NotFoundError because chat doesnt exist', async() => {
        const fakeId = ObjectId().toString()
        try {
            const chatId = await sendMessage(fakeId, id1, body)

            throw Error('should not reach this point')
        } catch (error) {

            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`chat with id ${fakeId} not found`)
        }
    })


    it('should throw an NotFoundError because user doesnt exist', async() => {
        const fakeId = ObjectId().toString()
        try {
            await sendMessage(chatId, fakeId, body)

            throw Error('should not reach this point')
        } catch (error) {

            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${fakeId} not found`)
        }
    })


    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {

        expect(() => sendMessage(1)).to.throw(TypeError, '1 is not a string')
        expect(() => sendMessage(true)).to.throw(TypeError, 'true is not a string')
        expect(() => sendMessage([])).to.throw(TypeError, ' is not a string')
        expect(() => sendMessage({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => sendMessage(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => sendMessage(null)).to.throw(TypeError, 'null is not a string')
        expect(() => sendMessage('')).to.throw(ContentError, 'chatId is empty or blank')
        expect(() => sendMessage(' \t\r')).to.throw(ContentError, 'chatId is empty or blank')

        expect(() => sendMessage(chatId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => sendMessage(chatId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => sendMessage(chatId, [])).to.throw(TypeError, ' is not a string')
        expect(() => sendMessage(chatId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => sendMessage(chatId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => sendMessage(chatId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => sendMessage(chatId, '')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => sendMessage(chatId, ' \t\r')).to.throw(ContentError, 'userId is empty or blank')

        expect(() => sendMessage(chatId, id1, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => sendMessage(chatId, id1, true)).to.throw(TypeError, 'true is not a string')
        expect(() => sendMessage(chatId, id1, [])).to.throw(TypeError, ' is not a string')
        expect(() => sendMessage(chatId, id1, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => sendMessage(chatId, id1, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => sendMessage(chatId, id1, null)).to.throw(TypeError, 'null is not a string')
        expect(() => sendMessage(chatId, id1, '')).to.throw(ContentError, 'body is empty or blank')
        expect(() => sendMessage(chatId, id1, ' \t\r')).to.throw(ContentError, 'body is empty or blank')

    })


    after(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))

})