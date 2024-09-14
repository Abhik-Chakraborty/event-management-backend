const express = require('express');
const { createEvent, getEvents, rsvpEvent, deleteEvent, viewAttendees, remindAttendees } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createEvent);
router.get('/', getEvents);
router.post('/:id/rsvp', protect([]), rsvpEvent);
router.delete('/:id', protect(['admin']), deleteEvent);
router.get('/:id/attendees', protect(['admin']), viewAttendees)
router.post('/:id/remind', protect(['admin']), remindAttendees);


module.exports = router;
