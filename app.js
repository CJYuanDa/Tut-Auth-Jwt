require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = 3000 || process.env.PORT;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// set view engine
app.set('view engine', 'ejs');

// connect to database
mongoose.connect(process.env.MONGODB_URI, /* { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } */)
    .then((result) => {
        console.log('Database connected');
        return app.listen(PORT);
    })
    .catch((error) => console.log(error));

// route
app.get('', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies
app.get('/set-cookies', (req, res) => {
    // res.setHeader('Set-Cookie', 'newUser=true') //seconde argument is cookies's name and value

    res.cookie('newUser', false);                 // session: the cookie will be deleted after closing the browser
    // third argument is an option object, maxAge (default: session): unit millisecond, secure true => only https can access it 
    res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true /*, secure: true */})
});

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    
    res.json(cookies);
});