require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveChat = require('.')
const { errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { ObjectId, database, models: { User, Chat, Message } } = require('upbeat-data')

describe.only('logic - retrieve-complete-user', () => {
    before(() => database.connect(TEST_DB_URL))

    const users = []
    const ids = []
    let id1, id2, chatId, username, email, password, message1, message2, messages


    beforeEach(async() => {
        await User.deleteMany()

        for (let index = 0; index < 3; index++) {
            username = `username-${random()}`
            email = `email-${random()}@mail.com`
            password = `password-${random()}`
            
    
            let user = { username, email, password }
            users.push(user)
           
        }

    

        const data = await User.insertMany(users)
        id1 = data[0].id
        id2 = data[1].id
    
        const chat = await Chat.create({ users: [ObjectId(id2), ObjectId(id1)], messages: [] })
        chatId = chat.id

        message1 = new Message({ user: ObjectId(id1), body: "First message", date: new Date })
        message1Id = message1.id

        message2 = new Message({ user: ObjectId(id2), body: "Second message", date: new Date })
        message2Id = message2.id

        messages = [message1, message2]


        chat.messages = messages
   

        await chat.save()

      
    })

    it('should return a correct chat', async() => {
        const _messages = await retrieveChat(chatId)

        _messages.forEach(element => {
            if (element.id === message1Id) {
                expect(element).to.exist
                expect(element.id).to.equal(message1Id)
                expect(element.user.toString()).to.equal(id1)
            } else if (element.id === message2Id) {
                expect(element).to.exist
                expect(element.id).to.equal(message2Id)
                expect(element.user.toString()).to.equal(id2)

            }

        })
    })

    it('should throw an NotFoundError because chat doesnt exist', async() => {
        const fakeId = ObjectId().toString()
        try {
            const chatId = await retrieveChat(fakeId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`chat with id ${fakeId} not found`)
        }
    })


    it('should fail on incorrect username, email, password, or expression type and content', () => {

        expect(() => retrieveChat(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveChat(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveChat([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveChat({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveChat(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveChat(null)).to.throw(TypeError, 'null is not a string')

        expect(() => retrieveChat('')).to.throw(ContentError, 'chatId is empty or blank')
        expect(() => retrieveChat(' \t\r')).to.throw(ContentError, 'chatId is empty or blank')

    })


    after(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})