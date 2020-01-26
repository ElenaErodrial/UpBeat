require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const toggleFavs = require('.')
const { errors: { NotFoundError } } = require('upbeat-util')
const { database, models: { User, Solo } } = require('upbeat-data')

describe('logic- toggle favs', () => {

    before(() => database.connect(TEST_DB_URL))

    let username, email, password, rol, rols, location, instruments, user, favs, idFav, userId
    rols = ['solo', 'groups']
    instrumentsList = ['drums', 'guitar', 'piano', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice']

    idFav = '5de2a648e1698e73a7564b5e'

    beforeEach(async () => {
        await User.deleteMany()

        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = rols[Math.floor(Math.random() * rols.length)]
        location = `location-${random()}`
        instruments = ['drums']
        format = new Solo({ instruments })
        favs = []
        
        user = await User.create({ username, email, password, rol, format, location, favs })
        userId = user.id
    })


    it ('should suceed on correct fav', async () => {
        
        const response = await toggleFavs(userId, idFav)
        expect(response).to.be.undefined
        user = await User.findById(userId)
        expect(user.favs).to.deep.include(idFav)

        
    })

    describe('when user already exists', () => {
        beforeEach(async () => {
            user = await User.findById(user.id)

            user.favs = [idFav]
            await user.save()
        })

        it ('should suceed on correct unfav', async () => {
        const response = await toggleFavs(userId, idFav)
            expect(response).to.be.undefined
            const user = await User.findById(userId)
            expect(user.favs).not.to.include(idFav)
        })
    })
    



})