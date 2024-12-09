const bcryptjs = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate authentication/ access
const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization header required' });
    }
    // Extract the encoded credentials from the Authorization header
    const base64Credentials = 
    authorizationHeader.split(' ')[1]; 
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [emailAddress, password] = credentials.split(':');

    // Find the user by email address
    const user = await User.findOne({ where: { emailAddress } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Compare the provided password by user with the stored hashed password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    //user data to the request object for use in future
    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { authenticateUser };