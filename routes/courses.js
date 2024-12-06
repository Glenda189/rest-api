const express = require('express');
const { Course } = require('../models');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

// Get all courses
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll();
  res.status(200).json(courses);
}));

// Create a new course
router.post('/', asyncHandler(async (req, res) => {
  const { title, description, estimatedTime, materialsNeeded, userId } = req.body;
  const newCourse = await Course.create({
    title,
    description,
    estimatedTime,
    materialsNeeded,
    userId,
  });
  res.status(201).json(newCourse);
}));

// Update a course by ID
router.put('/:id', asyncHandler(async (req, res) => {
  const { title, description, estimatedTime, materialsNeeded } = req.body;
  const course = await Course.findByPk(req.params.id);
  
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  course.title = title || course.title;
  course.description = description || course.description;
  course.estimatedTime = estimatedTime || course.estimatedTime;
  course.materialsNeeded = materialsNeeded || course.materialsNeeded;

  await course.save();
  res.status(200).json(course);
}));

// Delete a course by ID
router.delete('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  await course.destroy();
  res.status(204).end();
}));

module.exports = router;