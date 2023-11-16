
var db = require('../../dataBase/dataBase.js'); 
const fetch = require('node-fetch');
function checkEmailExists(email, db) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
          if (err) {
              reject(err);
          } else {
              resolve(row);
          }
      });
  });
};

function userNameExists(username, db) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [username], (err, row) => {
          if (err) {
              reject(err);
          } else {
              resolve(row);
          }
      });
  });
};
function insertNewUser(username, email, password, db) {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
      db.run(sql, [username, email, password], function(err) {
          if (err) {
              reject(err);
          } else {
              resolve(this.lastID);
          }
      });
  });
};
function checkUsernameMiddleware(req, res, next) {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Invalid username' });
    }
    functions.userNameExists(username, db)
      .then(result => {
        if (result) {
          return res.status(409).json({ error: 'Username already exists' });
        }

        next();
      })
      .catch(error => {
        console.error('Error checking username:', error);
        return res.status(500).json({ error: 'Internal server error' });
      });
  };
function checkEmailMiddleware(req, res, next) {
const { email } = req.body;

// Validate the email
if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
}

    functions.checkEmailExists(email, db)
        .then(result => {
        if (result) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        // Continue to the next middleware or route handler
        next();
        })
        .catch(error => {
        console.error('Error checking email:', error);
        return res.status(500).json({ error: 'Internal server error' });
        });
    };
//     return new Promise((resolve, reject) => {
//         const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
//         db.get(sql, [username, password], (err, row) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(!!row);
//             }
//         });
//     });
// };
function isCorrectPassword(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
      db.get(sql, [username, password], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });
  };
function deleteUser(username, db) {
    return fetch('http://localhost:3000/auth/delete-user', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }
        return response.json();
    });
};
function validateLogin(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    } else {
        req.session.userId = username; // <-- Setting session.userId
        console.log(`validateLogin username print : ${username}`);
        next();
    }
};

function authenticate(req, res, next) {
    const { username, password } = req.body;
    isCorrectPassword(username, password)
        .then((isCorrect) => {
            if (isCorrect) {
                req.session.userId = username;
                console.log(`Is correct Password required userId for ${username}`);
                next();
            } else {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
            }
        })
        .catch((error) => {
            console.error('Error during authentication:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        });
};
function performDeleteUser() {
    const usernameToDelete = document.getElementById('delete-username').value;

    deleteUser(usernameToDelete)
        .then(response => {
            console.log(response.message);
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
};
function sendRecoveryEmail(username) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'einatexpressproject@gmail.com', 
            pass: 'Ein@t160188', 
        },
    });

    const mailOptions = {
        from: 'einatexpressproject@gmail.com', 
        to: 'recipient_email@example.com', 
        subject: 'Password Recovery', 
        text: `Dear ${username},\n\nYour password is ...`, 
    };

    return transporter.sendMail(mailOptions);
};
function getUserEmail(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                // Resolve with the user's email or null if not found
                resolve(row ? row.email : null);
            }
        });
    });
};
module.exports = {
    insertNewUser,
    checkUsernameMiddleware,
    checkEmailMiddleware,
    userNameExists,
    checkEmailExists,
    deleteUser,
    performDeleteUser,
    sendRecoveryEmail,
    getUserEmail,
    authenticate,
    validateLogin,
    isCorrectPassword
};