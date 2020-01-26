require('dotenv').config()
const { validate } = require('upbeat-util')
const { ObjectId, models: { User } } = require('upbeat-data')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

/**
 * Saves user profile image.
 * 
 * @param {ObjectId} id
 * @param {Stream} file
 * @param {Sting} filename 
 *
 * @returns {Promise} - user.  
 */


module.exports = function(id, file, filename) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)
    /* fs.readFile(__dirname) */
    return (async() => {
        
        imgPath = path.join(__dirname, `../../public/data/users/${id}/${filename}`)
        route = path.join(__dirname, `../../public/data/users/${id}/`)
        try {
    
            const user = await User.findById(id)
            user.image = `http://localhost:8000/data/users/${id}/${filename}`
            await user.save()
            if (fs.existsSync(route)) {
                return file.pipe(fs.createWriteStream(imgPath))
            } else {
                fs.mkdirSync(route)
                return file.pipe(fs.createWriteStream(imgPath))
            }
        } catch (error) {
            return "error saving image"
        }
    })()
}