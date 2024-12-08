const express = require('express');
const { User } = require('../models');
const asyncHandler = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const router = express.Router();



// GET /api/users - Fetch authenticated user and gives 200 status
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
  });

  res.status(200).json(user);
}));


// POST /api/users - Creates a new user and gives a 201 status, returns a 400 status if error
router.post('/', asyncHandler(async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;

  if (!firstName || !lastName || !emailAddress || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await User.create({ firstName, lastName, emailAddress, password });
    res.status(201).location('/').end();
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Email address is already in use' });
    } else {
      throw error;
    }
  }
}));



module.exports = router;


