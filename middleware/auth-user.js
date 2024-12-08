const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  
  const token = req.headers.authorization.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  jwt.verify(token, 'Apple', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Attach decoded user information to the request
    next();
  });
};

module.exports = { authenticateUser };