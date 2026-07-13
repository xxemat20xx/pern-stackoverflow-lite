import { pool } from '../config/db';
import { Answer } from '../types/index';
import { prisma } from '../config/prisma';
export const createAnswer = async (body: string, questionId: number, authorId: number): Promise<Answer> => {

    const answer = await prisma.answer.create({
        data: {
            body,
            question: {
                connect: {
                    id: questionId
                }
            },
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    });

    return answer;
};

export const getAnswersByQuestion = async (questionId: number): Promise<Answer[]> => {
    const answers = await prisma.answer.findMany({
        where: {
            questionId
        },
        include: {
            author: {
                select: {
                    username: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    return answers;
};

export const acceptAnswer = async (answerId: number, userId: number): Promise<Answer | null> => {
    const answer = await prisma.answer.findFirst({
        where: {
            id: answerId,
            question: {
                authorId: userId
            }
        }
    });
    if (!answer) return null;

    const updatedAnswer = await prisma.answer.update({
        where: {
            id: answerId
        },
        data: {
            isAccepted: true
        }
    });

    return updatedAnswer;
};

