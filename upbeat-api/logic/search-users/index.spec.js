require('dotenv').config() 

const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const searchUsers = require('.')
const { errors: { NotFoundError, ContentError } } = require('upbeat-util')
const { database, ObjectId, models: { User, Groups, Solo } } = require('upbeat-data')
const bcrypt = require('bcryptjs')
const salt = 10

describe('logic - search musicians', () => {
    before(() => database.connect(TEST_DB_URL))

    let id , username, email, password, rol, rols, longitude, latitude, format, groups, query
    rols = ['solo', 'groups']
    instrumentsList = ['drums', 'guitar', 'violin', 'bass', 'cello', 'clarinet', 'double-bass', 'flute', 'oboe', 'saxophone', 'trombone', 'trumpet', 'ukelele', 'viola', 'voice']
    groupsList = ['band', 'choir', 'modernEnsemble', 'orchestra', 'classicChamber']
    let hash
    const users = []

    beforeEach(async () => {
     for (let index = 0; index < 10; index++) {
        username = `username-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        rol = rols[Math.floor(Math.random() * rols.length)]
        longitude = random()
        latitude = random()
        instruments = ['piano', instrumentsList[Math.floor(Math.random() * instrumentsList.length)]]
        groups = groupsList[Math.floor(Math.random() * groupsList.length)]
        if (rol === 'solo') format = new Solo({ instruments })
        else format = new Groups({ groups })
        hash = await bcrypt.hash(password, salt)

        let user = { username, email, password: hash, rol, location: {coordinates: [latitude, longitude]}, format }
        users.push(user)
       
    }
        await User.deleteMany()

        await User.insertMany(users)

    })

    
    it('should succeed on correct retrieve collecting elements according to filter', async () => {
        query = 'piano'
        
        const musicians = await searchUsers(query)
        
        expect(musicians).to.exist
        expect(musicians).to.be.an('array')
        
        musicians.forEach(musician => {
            expect(musician.username).to.exist
            expect(musician.username).to.be.a('string')
            expect(musician.format.instruments).to.exist
            expect(musician.format.instruments).to.be.an('array')
            expect(musician.format.instruments[0]).to.equal('piano')
            expect(musician.format.groups).to.be.undefined
       
        });
        
    })

    it('should succeed on correct retrieve all elements if empty query', async () => {
        query = ' '
        
        const musicians = await searchUsers(query)
        
        expect(musicians).to.exist
        expect(musicians).to.be.an('array')
        
        musicians.forEach(musician => {
            expect(musician.username).to.exist
            expect(musician.username).to.be.a('string')
    
            if (musician.format === 'solo')
            {
                expect(musician.instruments).to.exist
                expect(musician.instruments).to.be.an('array')
                expect(musician.instruments).to.be.oneOf('array')
            }
           
        });
    })
    after(() => User.deleteMany().then(database.disconnect))
})