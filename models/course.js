const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' },
      notNull: { msg: 'Title can not be empty'}
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' },
      notNull: { msg: 'Description can not be empty'}
    },
  },
  estimatedTime: {
    type: DataTypes.STRING,
  },
  materialsNeeded: {
    type: DataTypes.STRING,
  },
});

// Defines association between  course and user models
Course.associate = (models) => {
  Course.belongsTo(models.User, { foreignKey:{ allowNull: false, name: 'userId' }  });
};

module.exports = Course;

