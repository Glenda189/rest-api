const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'First name is required' },
      notEmpty: { msg: 'First name cannot be empty' },
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Last name is required' },
      notEmpty: { msg: 'Last name cannot be empty' },
    },
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Email address is required' },
      isEmail: { msg: 'Please provide a valid email address' },
      isUnique: async (value) => {
        const exists = await User.findOne({ where: { emailAddress: value } });
        if (exists) {
          throw new Error('Email address is already in use');
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Password is required' },
      notEmpty: { msg: 'Password cannot be empty' },
    },
    set(val) {
      if (val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      }
    },
  },
});

// Define association between user and course (has many)
User.associate = (models) => {
  User.hasMany(models.Course, { foreignKey: 'userId' });
};

User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User;