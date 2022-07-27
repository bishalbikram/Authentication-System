const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }, 
    fullName: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: 'user'
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User