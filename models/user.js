'use strict';

const {Model} = require('sequelize');
// const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name is required'
        },
        notEmpty: {
          msg: 'Please provide a First Name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Last Name is required'
      },
      validate: {
        notNull: {
          msg: 'A Last Name is required'
        },
        notEmpty: {
          msg: 'Please provide a Last Name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email Address must be unique'
      },
      validate: {
        notNull: {
          msg: 'Must be a valid email address'
        },
        notEmpty: {
          msg: 'Please provide an Email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
      },
    },
  });
    User.associate = (models) => {
      User.hasMany(models.Course, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      });
    };
  return User;
};
  