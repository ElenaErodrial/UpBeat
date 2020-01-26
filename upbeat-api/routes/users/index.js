const { Router } = require('express')
const { registerUser, authenticateUser, retrieveUser, modifyUser, addInstruments, deleteInstrument, toggleFavs, retrieveFavs, saveProfileImage, loadProfileImage, loadProfileImageUrl, searchUsers, retrieveMusicians, saveImage } = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('upbeat-util')

const jsonBodyParser = bodyParser.json()
const Busboy = require('busboy')

const router = Router()

router.post('/', jsonBodyParser, (req, res) => {
    const { body: { username, email, password, rol, instruments, groups, location} } = req

    try {
        registerUser(username, email, password, rol, instruments, groups, location)
            .then(() => res.status(201).end())
            .catch(error => {
                const { message } = error

                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })

    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { email, password } } = req

    try {
        authenticateUser(email, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, SECRET, { expiresIn: '1d' })

                res.json({ token })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveUser(id)
            .then(user => res.json(user))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})


router.post('/instruments', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { instru } } = req

        addInstruments(id, instru)
            .then(id => res.status(201).json({ id }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


router.delete('/:id', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { instru } } = req
        deleteInstrument(id, instru)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


router.patch('/profile', tokenVerifier, jsonBodyParser, (req, res) => {
    
    try {
        const { id , body: { username, email, password, description, image, links, upcomings, location } } = req

        modifyUser(id, username, email, password, description, image, links, upcomings, location)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.patch('/favs/:favId', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, params : {favId} } = req

        toggleFavs(id, favId)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/favs', tokenVerifier, (req, res) => {
    
    try {
        const { id } = req

        retrieveFavs(id)
        .then(favs => res.status(200).json({ favs }))
            
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/profile', tokenVerifier, (req, res) => {
    const {  id  } = req
    const busboy = new Busboy({ headers: req.headers })
    busboy.on('file', async(fieldname, file, filename, encoding, mimetype) => {
        filename = 'profile.png'
        await saveImage(id, file, filename)
    })
    busboy.on('finish', () => {
        res.end("That's all folks!")
    })
    return req.pipe(busboy)
})

router.get('/profileimage/:id', tokenVerifier, async(req, res) => {

    const { params: { id } } = req
    const stream = await loadProfileImage(id)
    res.setHeader('Content-Type', 'image/jpeg')
    return stream.pipe(res)
})

router.get('/profileimageUrl/:id', tokenVerifier, async(req, res) => {

    const { params: { id } } = req
    const imageUrl = await loadProfileImageUrl(id)
    res.json({ imageUrl })
})

router.get('/search/:query', (req, res) => {
    try {
        const { params: { query } } = req

        searchUsers(query)
            .then(results => res.status(201).json({ results }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }


})

router.get('/detail/:id', jsonBodyParser, (req, res) => {
    try {
        const { params : {id} } = req

        retrieveMusicians(id)
        .then(musician => res.status(201).json( musician ))
            
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})





module.exports = router



