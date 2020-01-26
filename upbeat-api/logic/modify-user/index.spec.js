require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const modifyUser = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError, ContentError }, polyfills: { arrayRandom } } = require('upbeat-util')
const { database, ObjectId, models: { User} } = require('upbeat-data')

arrayRandom()

describe('logic - modify user', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, username, email, password, description, image, links, upcomings, location

    beforeEach(async () => {
        username = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        description = `description-${random()}`
        image = `image-${random()}`
        links = `link-${random()}`
        upcomings = `upcomings-${random()}`
        location = `location-${random()}`

        await User.deleteMany()

        const user = await User.create({ username, email, password, description, image, links , upcomings, location })
        id = user.id
        await user.save()
        

})

    it('should succeed on correct user and user data', async () => {
   
        const newUsername = `new-username-${random()}`
        const newEmail = `new-email-${random()}@mail.com`
        const newPassword = `new-password-${random()}`
        const newDescription = `new-description-${random()}`
        const newImage = `new-image-${random()}`
        const newUpcomings = `new-upcomings-${random()}`
        const newLocation = `new-upcomings-${random()}`
        const newLinks = `links-${random()}`

       

        const response = await modifyUser(id, newUsername, newEmail, newPassword, newDescription, newImage, newLinks , newUpcomings, newLocation)

        expect(response).to.not.exist

        const user = await User.findById(id)   

        expect(user.id).to.equal(id)

        expect(user.username).to.exist
        expect(user.username).to.be.a('string')
        expect(user.username).to.have.length.greaterThan(0)
        expect(user.username).to.equal(newUsername)

        expect(user.email).to.exist
        expect(user.email).to.be.a('string')
        expect(user.email).to.have.length.greaterThan(0)
        expect(user.email).to.equal(newEmail)

        expect(user.password).to.exist
        expect(user.password).to.be.a('string')
        expect(user.password).to.have.length.greaterThan(0)
        expect(user.password).to.equal(newPassword)

        expect(user.description).to.exist
        expect(user.description).to.be.a('string')
        expect(user.description).to.have.length.greaterThan(0)
        expect(user.description).to.equal(newDescription)

        expect(user.image).to.exist
        expect(user.image).to.be.a('string')
        expect(user.image).to.have.length.greaterThan(0)
        expect(user.image).to.equal(newImage)

        expect(user.links).to.exist
        expect(user.links).to.be.a('string')
        expect(user.links).to.have.length.greaterThan(0)
        expect(user.links).to.equal(newLinks)

        expect(user.upcomings).to.exist
        expect(user.upcomings).to.be.a('string')
        expect(user.upcomings).to.have.length.greaterThan(0)
        expect(user.upcomings).to.equal(newUpcomings)

        expect(user.location).to.exist
        expect(user.location).to.be.a('string')
        expect(user.location).to.have.length.greaterThan(0)
        expect(user.location).to.equal(newLocation)


    })


    after(() => User.deleteMany().then(database.disconnect))
})