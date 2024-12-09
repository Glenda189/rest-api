const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const { sequelize } = require('./config/connection');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// Error Handler 
app.use((err, req, res, next) =>{
  console.log(err);
  res.status(err.status ||500).json({message: err.message});
});

// Database message and start server message 
sequelize.authenticate()
.then(() => console.log('Successfully connected to database'))
.catch((error) => console.error('Error connecting to the database:', error))

// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
  });
});


