//consts//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const functions = require('./functions.js');
var db = require("./dataBase.js");
const PORT = 4001;

app.use(express.json());
app.use(bodyParser.json());
//database// 
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      email TEXT,
      password TEXT
    )`);

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      title TEXT,
      content TEXT,
      author INTEGER,
      date TEXT,
      FOREIGN KEY (author) REFERENCES users(id)
    )`);
});

// Register a new user
const EventEmitter = require('events');

// Create an instance of EventEmitter
const eventEmitter = new EventEmitter();

// Register an event listener
eventEmitter.on('register', (username, email) => {
  // Perform registration actions
  console.log(`Registering user: ${username} with email: ${email}`);
  // Additional actions related to registration
});

// Trigger the 'register' event
eventEmitter.emit('register', 'JohnDoe', 'john@example.com');
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const userExists = await functions.checkUserName(username);
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const isValidPassword = functions.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const emailExists = await functions.checkEmailExists(email, db);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Additional validations or actions can be added here

    // If all validations pass, proceed with user registration
    functions.registerUser(username, password, email, res);
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
//Login a user
app.post('/login', (req, res,next) => {
    const { username, password } = req.body;
    const usernameExists = functions.usernameExists(username);
    if (!usernameExists) {
      res.status(400).json({ error: 'Username does not exist' });
    }
    const isCorrectPassword = functions.isCorrectPassword(password);
    if (!isCorrectPassword) {
      res.status(400).json({ error: 'Invalid password' });
    }
    res.json({ usernameExists, isCorrectPassword });
    document.getElementById('mail-login-btn').style.display = 'none';
    document.getElementById('loggedInMessage').style.display = 'block';
    next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
