const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'], // second value: custom error message
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'] // first value need a function to return true or false
    },
    password: {
        type: String,
        required: [true, 'Please enter an email'],
        minlength: [8, 'Minimum password is 8 characters']
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;