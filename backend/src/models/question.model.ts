// import { pool } from '../config/db';
import { Question } from '../types/index';
import { prisma } from '../config/prisma';

export const createQuestion = async (title: string, body: string, authorId: number): Promise<Question> => {
    const question = await prisma.question.create({
        data: {
            title,
            body,
            authorId,
        },
        select: {
            id: true,
            title: true,
            body: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return question;
};

export const getAllQuestions = async (): Promise<(Question & { username: string; answer_count: number })[]> => {
    const questions = await prisma.question.findMany({
        include: {
            author: {
                select: {
                    username: true
                }
            },
            _count: {
                select: {
                    answers: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return questions.map((q) => ({
        ...q,
        username: q.author?.username || '',
        answer_count: q._count.answers
    }))
};

export const getQuestionById = async (id: number): Promise<(Question & { username: string | null }) | undefined> => {
    const question = await prisma.question.findUnique({
        where: {
            id
        },
        include: {
            author: {
                select: {
                    username: true
                }
            },
            answers: true
        }
    });
    if (!question) return undefined;

    return {
        ...question,
        username: question.author?.username || null
    };
};

export const updateQuestionById = async (id: number, title: string, body: string): Promise<Question> => {
    const question = await prisma.question.update({
        where: {
            id
        },
        data: {
            title,
            body
        }
    });
    return question;
};

export const deleteQuestionById = async (id: number): Promise<void> => {
    await prisma.question.delete({
        where: {
            id
        }
    })
};