const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

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
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password is 8 characters']
    }
});

// fire a function after doc saved to db
// after save event occurs fire function
/* userSchema.post('save', function (doc, next) {
    console.log('new user was created & saved', doc);
    next();
}); */

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;