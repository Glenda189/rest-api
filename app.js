const express = require('express');
// const cors = require('cors');
const { sequelize } = require('./models');
const userRouter = require('./routes/users');
const courseRouter = require('./routes/courses');
const asyncHandler = require('./middleware/async-handler');

const app = express();
// app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);

// Sync the database
sequelize.sync().then(() => {
  console.log('Database synced successfully.');
}).catch((err) => {
  console.log('Error syncing database:', err);
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the REST API');
});

// Error handling middleware for 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
});

module.exports = app;