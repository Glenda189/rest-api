'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const authenticateUser = async (req, res, next) => {
  const credentials = auth(req);
  if (credentials) {
    const user = await User.findOne({ where: { emailAddress: credentials.name } });
    if (user) {
      // Compare passwords asynchronously
      const isPasswordCorrect = await bcrypt.compare(credentials.pass, user.password);
      if (isPasswordCorrect) {
        req.currentUser = user;
        return next();
      }
    }
  }
  res.status(401).json({ message: 'Access denied' });
};

module.exports = { authenticateUser };