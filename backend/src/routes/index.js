const express = require('express');
const authRoutes = require('./authRoutes');
const usersRoutes = require('./usersRoutes');
const notesRoutes = require('./notesRoutes');
const todosRoutes = require('./todosRoutes');
const sessionsRoutes = require('./sessionsRoutes');
const roomsRoutes = require('./roomsRoutes');
const blogsRoutes = require('./blogsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/notes', notesRoutes);
router.use('/todos', todosRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/rooms', roomsRoutes);
router.use('/blogs', blogsRoutes);

module.exports = router;