import express from 'express';
import { protect } from '../middleware/auth';
import {
    acceptAnswerHandler,
    createAnswerHandler,
    getAnswers,
} from '../controllers/answer.controller';

const router = express.Router({ mergeParams: true });

router.get('/', getAnswers);
router.post('/', protect, createAnswerHandler);
router.put('/:answerId/accept', protect, acceptAnswerHandler);



export default router;