import express from 'express';
import { protect } from '../middleware/auth';
import {
    createQuestionHandler,
    getQuestions,
    getQuestion,
    updateQuestionHandler,
    deleteQuestionHandler
} from '../controllers/questions.controller';

const router = express.Router();


router.post('/', protect, createQuestionHandler);
router.get('/', getQuestions);
router.get('/:id', getQuestion)
router.put('/:id', protect, updateQuestionHandler);
router.delete('/:id', protect, deleteQuestionHandler);

export default router;