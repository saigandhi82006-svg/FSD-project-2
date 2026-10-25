import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { uploadAvatar as multerUpload } from '../middleware/upload.js';

const router = express.Router();

router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

router.patch('/me', protect, updateProfile);
router.post('/me/avatar', protect, multerUpload.single('avatar'), uploadAvatar);
router.get('/:id', optionalAuth, getProfile);

export default router;
