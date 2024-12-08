const express = require('express');
const { Course, User } = require('../models');
const asyncHandler = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');  // Import the authenticateUser middleware
const router = express.Router();

// GET /api/courses - Returns a list of courses 
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: { excludes: ['createdAt', 'updatedAt']},
    include: { model: User, attributes: ['id', 'firstName', 'lastName'] }, // Include user data
  });
  res.status(200).json(courses);
}));

// GET /api/courses/:id - Returns a course by ID 
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: { excludes: ['createdAt', 'updatedAt']},
    include: { model: User, attributes: ['id', 'firstName', 'lastName'] },
  });

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  res.status(200).json(course);
}));

// POST /api/courses - Creates a new course
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const course = await Course.create({
    title,
    description,
    userId: req.user.id, // Associate the course with the authenticated user
  });

  // Set location header and return no content
  res.setHeader('Location', `/api/courses/${course.id}`);
  res.status(201).end();
}));

// PUT /api/courses/:id - Updates a course and No content on success
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const course = await Course.findByPk(req.params.id);

  if (!course || course.userId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to modify this course' });
  }

  course.title = title;
  course.description = description;
  await course.save();

  res.status(204).end(); 
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