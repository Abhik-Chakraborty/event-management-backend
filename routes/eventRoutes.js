const express = require('express');
const { createEvent, getEvents, rsvpEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createEvent);
router.get('/', getEvents);
router.post('/:id/rsvp', protect, rsvpEvent);

module.exports = router;
