const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'production' 
    ? '/app/data/database.sqlite' 
    : path.join(__dirname, '../../data/database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = sequelize;