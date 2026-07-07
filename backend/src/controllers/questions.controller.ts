import { Response, Request } from 'express';
import {
    createQuestion,
    getAllQuestions,
    getQuestionById
} from '../models/question.model';


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