const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {}
  
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, { sequelize });

  return Course;
};
