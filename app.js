require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authmiddleware');

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
app.get('*', checkUser);
app.get('', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);