const express = require('express');
const { User } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const asyncHandler = require('../middleware/async-handler')
const router = express.Router();

// Post route to create new user and 201 status
router.post('/', asyncHandler(async (req, res) => {
    const { firstName, lastName, emailAddress, password } = req.body;
  
    try {
      await User.create(req.body);
      res.status(201).location('/').end();
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        return res.status(400).json({ errors });

      } else if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email address is already in use'});   
      } else {
        throw error;
      }
    }
  }));

  // GET route to return users and 200 status (Authenticated user displays)
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
  });

  res.status(200).json(user);
}));

module.exports = router;