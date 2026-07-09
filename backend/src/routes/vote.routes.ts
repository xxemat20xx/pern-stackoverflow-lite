import express from 'express';
import {
    castVote,
    removeVoteHandler,
    getVoteCountsHandler,
    getUserVoteHandler
} from '../controllers/vote.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Protected routes (require login)
router.post('/', protect, castVote);
router.delete('/:target_type/:target_id', protect, removeVoteHandler);
router.get('/me/:target_type/:target_id', protect, getUserVoteHandler);

// Public route (no login required)
router.get('/:target_type/:target_id/counts', getVoteCountsHandler);

export default router;