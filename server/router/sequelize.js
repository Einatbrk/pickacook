const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../../dataBase/blog_platform.db',
  logging: (msg) => {
    console.log('Sequelize log:', msg);
}});

const Session = sequelize.define('Session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  expires: {
    type: Sequelize.DATE,
  },
  data: {
    type: Sequelize.TEXT,
  },
});

sequelize.sync()
  .then(() => {
    console.log('Database models synced');
  })
  .catch((error) => {
    console.error('Error syncing database models:', error);
  });

module.exports = { sequelize, Session };
