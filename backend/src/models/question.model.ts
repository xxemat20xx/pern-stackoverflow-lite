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

export const getAllQuestions = async () => {
    const questions = await prisma.question.findMany({
        include: {
            author: { select: { username: true } },
            _count: { select: { answers: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return questions.map((q) => ({
        id: q.id,
        title: q.title,
        body: q.body,
        author_id: q.authorId,
        created_at: q.createdAt,
        updated_at: q.updatedAt,
        username: q.author?.username || '',
        answer_count: q._count.answers,
    }));
};

export const getQuestionById = async (id: number) => {
    const question = await prisma.question.findUnique({
        where: { id },
        include: {
            author: { select: { username: true } },
            answers: true,
        },
    });
    if (!question) return undefined;

    // ✅ Return the exact shape your frontend expects
    return {
        id: question.id,
        title: question.title,
        body: question.body,
        author_id: question.authorId,
        created_at: question.createdAt,
        updated_at: question.updatedAt,
        username: question.author?.username || null,
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
    });
};