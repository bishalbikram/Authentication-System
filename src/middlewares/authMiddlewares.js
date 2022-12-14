const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const User = require('../models/user')

const authMiddlewares = {}

authMiddlewares.issueToken = async (user) => {
    const payload = {
        id: user._id
    }
    const expiresIn = '7d'
    const pathToPrivateKey = path.join(__dirname, '..', 'privateKey.pem')
    const privateKey = fs.readFileSync(pathToPrivateKey, 'utf8')
    const signedToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn })
    user.tokens = user.tokens.concat({ token: signedToken })
    await user.save()
    return {
        token: 'Bearer ' + signedToken,
        expiresIn
    }
}

authMiddlewares.authenticate = async (req, res, next) => {
    try {
        const pathToPublicKey = path.join(__dirname, '..', 'publicKey.pem')
        const publicKey = fs.readFileSync(pathToPublicKey, 'utf8')
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, publicKey)
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': token })
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (err) {
        res.status(401).json({ error: 'You are not authorized to visit this route.' })
    }
}

module.exports = authMiddlewares