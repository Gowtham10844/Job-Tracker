// routes/interviews.js
import express from 'express';
import { getInterviews } from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getInterviews);

export default router;
