import { Request, Response } from "express";
import {
    createAnswer,
    getAnswerByQuestions,
    acceptAnswer
} from '../models/answer.model';


export const createAnswerHandler = async (req: Request, res: Response) => {
    const { body } = req.body;
    const { questionId } = req.params;
    const userId = req.user!.id;

    try {
        const answer = await createAnswer(body, Number(questionId), userId);
        return res.status(201).json(answer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create answer' });
    }
}

export const getAnswers = async (req: Request, res: Response) => {
    const { questionId } = req.params;
    try {
        const answers = await getAnswerByQuestions(Number(questionId));
        res.json(answers);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

export const acceptAnswerHandler = async (req: Request, res: Response) => {
    const { answerId } = req.params;
    const userId = req.user!.id;

    try {
        const answer = await acceptAnswer(Number(answerId), userId);
        if (!answer) return res.status(403).json({ error: 'Only the question author can accept an answer' })
        return res.json(answer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept answer' })
    }
}