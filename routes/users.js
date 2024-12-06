const express = require('express');
const { User } = require('../models');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

// Get all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
}));

// Create a new user
router.post('/', asyncHandler(async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;
  
  // Hash the password??
  const bcrypt = require('bcrypt');
const newUser = await User.create({
  firstName,
  lastName,
  emailAddress,
  password: bcrypt.hashSync(password, 10),
});

}));

// Update a user by ID
router.put('/:id', asyncHandler(async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
// Rehash the password if it is being updated ????
let hashedPassword = user.password;
if (password) {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  hashedPassword = bcrypt.hashSync(password, saltRounds);
}
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.emailAddress = emailAddress || user.emailAddress;
  user.password = password || user.password;

  await user.save();
  res.status(200).json(user);
}));

// Delete a user by ID
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.destroy();
  res.status(204).end();
}));

module.exports = router;