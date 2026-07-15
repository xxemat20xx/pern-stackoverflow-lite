import { prisma } from '../config/prisma';

// 1. CREATE ANSWER
export const createAnswer = async (body: string, questionId: number, authorId: number) => {
    const answer = await prisma.answer.create({
        data: {
            body,
            questionId,
            authorId
        },
        include: {
            author: {
                select: { username: true }
            }
        }
    });

    // ✅ Map Prisma camelCase to frontend snake_case
    return {
        id: answer.id,
        body: answer.body,
        question_id: answer.questionId,
        author_id: answer.authorId,
        is_accepted: answer.isAccepted || false,
        created_at: answer.createdAt,
        updated_at: answer.updatedAt,
        username: answer.author?.username || null
    };
};

// 2. GET ANSWERS
export const getAnswersByQuestion = async (questionId: number) => {
    const answers = await prisma.answer.findMany({
        where: {
            questionId
        },
        include: {
            author: {
                select: { username: true }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    // ✅ Map each answer to the frontend shape
    return answers.map((ans) => ({
        id: ans.id,
        body: ans.body,
        question_id: ans.questionId,
        author_id: ans.authorId,
        is_accepted: ans.isAccepted,
        created_at: ans.createdAt,
        updated_at: ans.updatedAt,
        username: ans.author?.username || null
    }));
};


// 3. ACCEPT ANSWER
export const acceptAnswer = async (answerId: number, userId: number) => {
    // 1. Find the answer and verify the user is the question author
    console.log('🔥 acceptAnswer called', { answerId, userId });
    const answer = await prisma.answer.findFirst({
        where: {
            id: answerId,
            question: {
                authorId: userId,
            },
        },
        include: {
            question: true,
            author: { select: { username: true } },
        },
    });
    if (!answer) return null;


    // The author can now switch the accepted answer at any time!

    // 2. Unset `isAccepted` on ALL answers of this question
    await prisma.answer.updateMany({
        where: {
            questionId: answer.questionId,
        },
        data: {
            isAccepted: false,
        },
    });

    // 3. Set the chosen answer to accepted
    const updatedAnswer = await prisma.answer.update({
        where: {
            id: answerId,
        },
        data: {
            isAccepted: true,
        },
        include: {
            author: {
                select: { username: true },
            },
        },
    });

    // 4. Return the answer in the shape your frontend expects
    return {
        id: updatedAnswer.id,
        body: updatedAnswer.body,
        question_id: updatedAnswer.questionId,
        author_id: updatedAnswer.authorId,
        is_accepted: updatedAnswer.isAccepted,
        created_at: updatedAnswer.createdAt,
        updated_at: updatedAnswer.updatedAt,
        username: updatedAnswer.author?.username || null,
    };
};