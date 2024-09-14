const Event = require('../models/eventModel');

// Create new event
exports.createEvent = async (req, res) => {
  const { title, description, date, time, location } = req.body;
  const event = await Event.create({
    title,
    description,
    date,
    time,
    location,
    createdBy: req.user.id,
  });
  res.status(201).json(event);
};

// Get all events
exports.getEvents = async (req, res) => {
  const events = await Event.find().populate('attendees', 'name email');
  res.json(events);
};

// RSVP to event
exports.rsvpEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  event.attendees.push(req.user.id);
  await event.save();

  res.json({ message: 'RSVP successful', event });
};
