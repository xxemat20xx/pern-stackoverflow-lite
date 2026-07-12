import { Response, Request } from 'express';
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestionById,
    deleteQuestionById
} from '../models/question.model';
import { pool } from '../config/db';


export const createQuestionHandler = async (req: Request, res: Response) => {
    const { title, body } = req.body;
    const userId = req.user!.id;
    try {
        const question = await createQuestion(title, body, userId);
        res.status(201).json(question);
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await getAllQuestions();
        res.json(questions);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const getQuestion = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const question = await getQuestionById(Number(id));
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const updateQuestionHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, body } = req.body;
    const userId = req.user!.id;
    try {
        // 1. Auth check: Ensure the user is the author (Business logic stays in controller)
        const checkUser = await pool.query('SELECT author_id FROM questions WHERE id = $1', [id]);
        if (checkUser.rows[0].author_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not the author of this question' });
        }
        if (checkUser.rows.length === 0) return res.status(404).json({ error: 'Question not found' });
        const updatedQuestion = await updateQuestionById(Number(id), title, body);
        res.json(updatedQuestion);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const deleteQuestionHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
        // 1. Auth check
        const check = await pool.query('SELECT author_id FROM questions WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Question not found' });
        if (check.rows[0].author_id !== userId) {
            return res.status(403).json({ error: 'You are not the author of this question' });
        }

        // 2. Call the model to perform the actual delete
        await deleteQuestionById(Number(id));
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete question' });
    }
};