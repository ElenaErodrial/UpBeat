require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveChats = require('.')
const { errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, database, models: { User, Chat } } = require('upbeat-data')

describe('logic - retrieveChats', () => {
    before(() => database.connect(TEST_DB_URL))

    let id1, chatId1, chatId2, username, email, password, chatsArray


    beforeEach(async() => {
        await User.deleteMany()

        //PERSON
        username = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`


        const user1 = await User.create({ username, email, password })
        id1 = user1.id

        const chat1 = await Chat.create({ users: [ObjectId(id1)], messages: [] })
        chatId1 = chat1.id

        const chat2 = await Chat.create({ users: [ObjectId(id1)], messages: [] })
        chatId2 = chat2.id

        chatsArray = [chatId1, chatId2]
    })

    it('should return a correct chat', async() => {
        const chats = await retrieveChats(id1)

        chats.forEach(element => {
            expect(element).to.exist
            expect(element.id).to.be.oneOf(chatsArray)
            expect(element.users.toString()).to.equal(id1)

        })
    })

    it('should throw an NotFoundError because chat doesnt exist', async() => {
        const fakeId = ObjectId().toString()
        try {
            const chatId = await retrieveChats(fakeId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${fakeId} not found`)
        }
    })



    it('should fail on incorrect username, email, password, or expression type and content', () => {

        expect(() => retrieveChats(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveChats(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveChats([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveChats({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveChats(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveChats(null)).to.throw(TypeError, 'null is not a string')
        expect(() => retrieveChats('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => retrieveChats(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

    })


    after(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})