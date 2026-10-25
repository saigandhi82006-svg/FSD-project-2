import express from 'express';
import {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  cancelRequest
} from '../controllers/mentorshipController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createRequest);
router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);
router.patch('/:id/status', updateRequestStatus);
router.patch('/:id/cancel', cancelRequest);

export default router;
