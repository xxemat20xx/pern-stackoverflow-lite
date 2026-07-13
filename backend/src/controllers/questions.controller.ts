import { Response, Request } from 'express';
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestionById,
    deleteQuestionById
} from '../models/question.model';
import { prisma } from "../config/prisma";


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
        const question = await prisma.question.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                authorId: true
            }
        });

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        if (question.authorId !== userId) {
            return res.status(403).json({
                error: "Forbidden: You are not the author of this question"
            });
        }

        const updatedQuestion = await updateQuestionById(
            Number(id),
            title,
            body
        );

        res.json(updatedQuestion);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteQuestionHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
        const question = await prisma.question.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                authorId: true
            }
        });

        if (!question) {
            return res.status(404).json({
                error: "Question not found"
            });
        }

        if (question.authorId !== userId) {
            return res.status(403).json({
                error: "You are not the author of this question"
            });
        }

        await deleteQuestionById(Number(id));

        res.json({
            message: "Question deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete question"
        });
    }
};