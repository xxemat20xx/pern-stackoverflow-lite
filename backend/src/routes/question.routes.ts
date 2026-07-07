import express from 'express';
import { protect } from '../middleware/auth';
import {
    createQuestionHandler,
    getQuestions,
    getQuestion
} from '../controllers/questions.controller';

const router = express.Router();


router.post('/', protect, createQuestionHandler);
router.get('/', getQuestions);
router.get('/:id', getQuestion)

export default router;