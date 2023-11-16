const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'blog_platform.db');
const dbInstance = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

dbInstance.serialize(() => {
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      email TEXT,
      password TEXT
    )`);

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS posts (
      ID INTEGER PRIMARY KEY,
      title TEXT,
      content TEXT,
      author INTEGER,
      date TEXT,
      checkBoxMarks TEXT,
      pictureLink TEXT,
      FOREIGN KEY (author) REFERENCES users(id)
    )`);
  
    
  dbInstance.run(`
  CREATE TABLE IF NOT EXISTS checkboxes (
    checkboxId INTEGER PRIMARY KEY,
    label TEXT
);
  `);
  dbInstance.run(`
  CREATE TABLE IF NOT EXISTS post_checkboxes (
    postId INTEGER,
    checkboxId INTEGER,
    FOREIGN KEY (postId) REFERENCES posts(postId),
    FOREIGN KEY (checkboxId) REFERENCES checkboxes(checkboxId),
    PRIMARY KEY (postId, checkboxId)
);
  `);
  dbInstance.run(`
  CREATE TABLE IF NOT EXISTS post_checkboxes (
    postId INTEGER,
    checkboxId INTEGER,
    FOREIGN KEY (postId) REFERENCES posts(postId),
    FOREIGN KEY (checkboxId) REFERENCES checkboxes(checkboxId),
    PRIMARY KEY (postId, checkboxId)
);
  `);
});
module.exports = dbInstance;
