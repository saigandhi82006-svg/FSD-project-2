import express from 'express';
import {
  getAlumniDirectory,
  getAlumniById
} from '../controllers/alumniController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAlumniDirectory);
router.get('/:id', optionalAuth, getAlumniById);

export default router;
