import { prisma } from "../config/prisma";
import { Comment } from "../types";


export const createComment = async (
    body: string,
    authorId: number,
    targetType: 'question' | 'answer',
    targetId: number,
): Promise<Comment> => {

    const comment = await prisma.comment.create({
        data: {
            body,
            authorId,
            targetType,
            targetId
        }
    });

    return {
        ...comment,
        author_id: comment.authorId,
        target_type: comment.targetType,
        target_id: comment.targetId,
        created_at: comment.createdAt
    } as Comment;
};


export const getCommentsByTarget = async (
    targetType: 'question' | 'answer',
    targetId: number
): Promise<(Comment & { username: string })[]> => {

    const comments = await prisma.comment.findMany({
        where: {
            targetType,
            targetId
        },
        include: {
            author: {
                select: {
                    username: true
                }
            }
        },
        orderBy: {
            createdAt: "asc"
        }
    });


    return comments.map((comment) => ({
        ...comment,
        author_id: comment.authorId,
        target_type: comment.targetType,
        target_id: comment.targetId,
        created_at: comment.createdAt,
        username: comment.author.username
    })) as (Comment & { username: string })[];
};