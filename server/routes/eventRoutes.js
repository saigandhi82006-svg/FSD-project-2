import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
  cancelEventRegistration,
  getMyRegistrations
} from '../controllers/eventController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { restrictTo } from '../middleware/roles.js';

const router = express.Router();

router.get('/', optionalAuth, getEvents);
router.get('/me/registrations', protect, getMyRegistrations);
router.get('/:id', optionalAuth, getEventById);

router.post('/', protect, restrictTo('ADMIN', 'ALUMNI'), createEvent);
router.patch('/:id', protect, restrictTo('ADMIN', 'ALUMNI'), updateEvent);
router.delete('/:id', protect, restrictTo('ADMIN', 'ALUMNI'), deleteEvent);

router.post('/:id/register', protect, registerEvent);
router.delete('/:id/register', protect, cancelEventRegistration);

export default router;
