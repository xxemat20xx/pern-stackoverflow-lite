import express from 'express';
import { createCommentHandler, getComments } from '../controllers/comment.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Create a comment (requires login)
router.post('/', protect, createCommentHandler);

// Get comments for a specific target (question or answer)
router.get('/:targetType/:targetId', getComments);

export default router;
