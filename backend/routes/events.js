const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.patch('/:id/status', eventController.updateEventStatus);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
