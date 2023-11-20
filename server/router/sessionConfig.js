const session = require('express-session');
const SequelizeStore = require('express-session-sequelize')(session.Store);
const { sequelize } = require('./sequelize.js');

const oneDay = 1000 * 60 * 60 * 24;

const sessionConfig = {
  secret: 'thisismysecrctekey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  store: new SequelizeStore({
    db: sequelize,
    expiration: oneDay,
    table: 'Session',
  }),
};

module.exports = sessionConfig;
