const User = require('../models/User');

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
        
    }
    
    res.send('new signup');
}

function login_post(req, res) {
    res.send('user login');
}

module.exports = {
    signup_get, login_get, signup_post, login_post
};