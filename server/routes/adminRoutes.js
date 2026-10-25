import express from 'express';
import {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  verifyAlumni,
  moderateJob,
  getContactMessages,
  updateContactStatus
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/roles.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/alumni/:id/verification', verifyAlumni);
router.patch('/jobs/:id/moderation', moderateJob);
router.get('/contact-messages', getContactMessages);
router.patch('/contact-messages/:id', updateContactStatus);

export default router;
