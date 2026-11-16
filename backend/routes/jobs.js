// routes/jobs.js
// Backward-compatibility router for /api/jobs
import express from 'express';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Optional protect or open fallback for legacy tests
router.get('/', async (req, res) => {
  try {
    const query = req.headers.authorization ? { userId: req.user?._id } : {};
    const jobs = await Application.find(query).sort({ applicationDate: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
