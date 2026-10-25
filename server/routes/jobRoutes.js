import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  toggleBookmark,
  getSavedJobs
} from '../controllers/jobController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { restrictTo } from '../middleware/roles.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);
router.get('/saved', protect, getSavedJobs);
router.get('/me', protect, restrictTo('ALUMNI', 'ADMIN'), getMyJobs);
router.get('/:id', optionalAuth, getJobById);

router.post('/', protect, restrictTo('ALUMNI', 'ADMIN'), createJob);
router.patch('/:id', protect, restrictTo('ALUMNI', 'ADMIN'), updateJob);
router.delete('/:id', protect, restrictTo('ALUMNI', 'ADMIN'), deleteJob);

router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
