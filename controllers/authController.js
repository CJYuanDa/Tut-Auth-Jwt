const User = require('../models/User');

// handle errors
function handleErrors(error) {
    console.log(error.message, error.code);
    let errors = { email: '', password: '' };

    // duplicat error code
    if (error.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors
}

function signup_get(req, res) {
    res.render('signup');
}

function login_get(req, res) {
    res.render('login');
}

async function signup_post(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        res.status(201).json(user);
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
}

async function login_post(req, res) {
    const { email, password } = req.body;
    console.log(email, password);
    res.send('user login');  
}

module.exports = {
    signup_get, login_get, signup_post, login_post
};