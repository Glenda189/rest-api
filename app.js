const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/connection');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

const app = express();

// Middleware
app.use(bodyParser.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// Error Handler 
app.use((err, req, res, next) =>{
  res.status(err.status ||500).json({message: err.message});
});


// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
  });
});


