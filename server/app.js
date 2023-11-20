const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const path = require('path');

const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'einatexpressproject@gmail.com',
    pass: 'Ein@t160188'
  }
});

const corsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessions for whole app
app.use(session(require('./router/sessionConfig.js')));

// Session middleware
app.use(require('./mw/session.js').logSessionId)

// Static files
app.use(express.static(path.join(__dirname, '../client')));

// Authentication routes
app.use('/auth', require('./router/authApi.js'));

// tests
// app.get('/:pageName', (req, res) => {
//     const pageName = req.params.pageName;
//     res.json(`Welcome to ${pageName} page`);
// });
// app.get('/:userId', (req, res) => {
//   const userId = req.params.userId;
//   res.json(`Welcome${userId}`);
// });

app.set('transporter', transporter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
