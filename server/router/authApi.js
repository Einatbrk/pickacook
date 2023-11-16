const express = require('express');
const sequelize = require('./sequelize.js');
const router = express.Router();
const db = require('../../dataBase/dataBase.js');
const functions = require('../helper/functions.js');
const session = require('express-session');
const SequelizeStore = require('express-session-sequelize')(session.Store);
const nodemailer = require('nodemailer');
const oneDay = 1000 * 60 * 60 * 24;
const sessionConfig = require('./sessionConfig.js');

router.use(session(sessionConfig));
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const usernameExists = await functions.userNameExists(username, db);
        if (usernameExists) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const emailExists = await functions.checkEmailExists(email, db);
        if (emailExists) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const userId = await functions.insertNewUser(username, email, password, db);
        res.json({ success: true, userId });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/check-username', functions.checkUsernameMiddleware, (req, res) => {
    const { username } = req.body;
    console.log(`Checking username ${username}`);

    functions.userNameExists(username, db)
        .then(result => {
            // Process the result (check if username exists) and send a response
            if (result) {
                res.json({ exists: true });
            } else {
                // Username does not exist, you can perform additional actions here
                // For example, send a success message
                res.json({ exists: false, message: 'Username does not exist' });
            }
        })
        .catch(error => {
            console.error('Error checking username:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});
router.post('/check-email',functions.checkEmailMiddleware, (req, res) => {
    const { email } = req.body;
    functions.checkEmailExists(email, db)
    .then(result => {
        // Process the result (check if email exists) and send a response
        res.json({ exists: !!result });
    })
    .catch(error => {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
});
router.delete('/delete-user', (req, res) => {
    const { username } = req.body;

    // Validate the username (you may want to add more validation)
    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Invalid username' });
    }

    functions.deleteUser(username, db)
        .then(rowsAffected => {
            res.json({ message: `${rowsAffected} row(s) deleted.` });
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});
router.post('/recover-password-username', (req, res) => {
    const { username } = req.body;

    // Fetch user's email based on the provided username
    getUserEmail(username)
        .then(email => {
            // Check if the email is found
            if (email) {
                // TODO: Implement password recovery logic based on the user's email
                // You can use Nodemailer to send a recovery email here

                // For now, simulate success
                res.json({ success: true });
            } else {
                // If the email is not found, return an error
                res.status(404).json({ success: false, error: 'User not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching user email:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        });
});
router.post('/recover-password-email', (req, res) => {
    const { email } = req.body;

    // Fetch user's email based on the provided username
    checkEmailExists(email, db)
        .then(result => {
            if (result) {
                const mailOptions = {
                    from: 'einatexpressproject@gmail.com',
                    to: email,
                    subject: 'Password Recovery',
                    text: 'Your password recovery link: http://your-recovery-link'
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        res.status(500).json({ success: false, error: 'Internal server error' });
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.json({ success: true, message: 'Recovery email sent successfully' });
                    }
                });
            } else {
                res.status(404).json({ success: false, error: 'Email not found' });
            }
        })
        .catch(error => {
            console.error('Error checking email:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        });
});

router.post('/login', functions.validateLogin, functions.authenticate, (req, res) => {
    console.log('Session ID for user:', req.sessionID);
    console.log('Session user ID in login route:', req.session.userId);

    res.json({ success: true, user: req.user, sessionID: req.sessionID, userId: req.session.userId });
});

router.post('/logout', (req, res) => {
    console.log('Session ID for user in logout route:', req.sessionID);
    console.log('Session user ID in logout route:', req.session.userId);

    if (!req.session.userId) {
        return res.status(401).json({ success: false, error: 'User not logged in' });
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error during session destruction:', err);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
        res.json({ success: true });
    });
});



module.exports = router;
