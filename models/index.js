'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')['development'];
const db = {};

// Test database Connection! 
const sequelize = new Sequelize(config);
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully!');
  })
  .catch((error) => {
    console.error('Unable to connect to the database',error);
  });


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log('All models and associations have been set up successfully!')

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
