'use strict';
const { Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A name is required'
        },
        notEmpty: {
          msg: 'Please provide a name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
       isEmail: {
        msg: 'Valid email address is required'
       } },
      },
    password: {
      type: DataTypes.STRING,  
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a password'}},
  }, 
}, { sequelize });
//  User.associate = ( models ) => {
//   User.hasMany(models.Course, {
//     foreignKey: 'userId'
//   })
//  };
  return User;
};
  