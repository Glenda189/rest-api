'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    title: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: {
          msg:'Title is required',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required',
        },
      },
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING,
  });

  Course.associte = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      }
    });
  };
  return Course;
};