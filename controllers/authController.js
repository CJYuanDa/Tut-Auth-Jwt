require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
function handleErrors(error) {
    // console.log(error.message, error.code);
    let errors = { email: '', password: '' };

    // Incorrect email or password
    if (error.message === 'Incorrect email') {
        errors.email = 'That email is not registered.'
    }
    if (error.message === 'Incorrect password') {
        errors.password = 'That password is incorrect.';
    }

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

const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge // Unit: second
    });
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
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
}

async function login_post(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
}

function logout_get (req, res) {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports = {
    signup_get, login_get, signup_post, login_post, logout_get
};