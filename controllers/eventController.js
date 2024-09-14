const Event = require('../models/eventModel');

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

exports.getEvents = async (req, res) => {
  const events = await Event.find().populate('attendees', 'name email');
  res.json(events);
};

exports.rsvpEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  event.attendees.push(req.user.id);
  await event.save();

  res.json({ message: 'RSVP successful', event });
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
}

exports.viewAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event.attendees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendees', error: err.message });
  }
}

exports.remindAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate('attendees');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update each attendee's reminder flag
    const attendees = event.attendees;
    attendees.forEach(async (attendee) => {
      attendee.reminder = true;
      await attendee.save();
    });

    res.status(200).json({ message: 'Reminder notifications set for attendees' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting reminders', error: error.message });
  }
}



