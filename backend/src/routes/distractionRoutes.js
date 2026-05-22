const express = require('express');
const { coachDistraction } = require('../controllers/distractionController');

const router = express.Router();

router.post('/coach', coachDistraction);

module.exports = router;
