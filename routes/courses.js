const express = require('express');
const { Course, User } = require('../models');
const asyncHandler = require('../middleware/async-handler'); // Import async handler middleware
const { authenticateUser } = require('../middleware/auth-user');  // Import the authenticateUser middleware
const router = express.Router();

// GET /api/courses - Returns a list of courses 
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt']},
    include: { model: User, attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }, // Include the data from user 
  });
  res.status(200).json(courses);
}));

// GET /api/courses/:id - Returns a course by ID 
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk( req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: { model: User, 
      attributes: ['id', 'firstName', 'lastName', 'emailAddress'] },
  });

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  res.status(200).json(course);
}));

// POST /api/courses - Creates a new course
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create({ 
      ...req.body, 
      userId: req.user.id 
    });
    res.setHeader('Location', `/api/courses/${course.id}`);
    res.status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ errors: error.errors.map(err => err.message) });
    } else {
      throw error;
    }
  }
}));



// PUT /api/courses/:id - Updates a course and No content 
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course || course.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to modify this course' });
    }

    await course.update(req.body);
    res.status(204).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ errors: error.errors.map(err => err.message) });
    } else {
      throw error;
    }
  }
}));


// DELETE /api/courses/:id - Deletes a course and returns no content 
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (!course || course.userId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to delete this course' });
  }

  await course.destroy();
  res.status(204).end();
}));

module.exports = router;
