import { Request, Response } from 'express';
import { createComment, getCommentsByTarget } from '../models/comment.model';

export const createCommentHandler = async (req: Request, res: Response) => {
    const { body, target_type, target_id } = req.body;
    const userId = req.user!.id;

    if (!['question', 'answer'].includes(target_type)) {
        return res.status(400).json({ error: 'Invalid target_type. Must be "question" or "answer"' });
    }
    try {
        const comment = await createComment(
            body,
            userId,
            target_type,
            target_id
        );
        res.status(201).json(comment);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create comment' });
    }
}

export const getComments = async (req: Request, res: Response) => {
    const { targetType, targetId } = req.params;

    if (typeof targetType !== 'string' || !['question', 'answer'].includes(targetType)) {
        return res.status(400).json({ error: 'Invalid targetType' });
    }

    const parsedTargetId = Number(targetId);
    if (isNaN(parsedTargetId) || parsedTargetId <= 0) {
        return res.status(400).json({ error: 'Invalid targetId' });
    }

    try {
        const comments = await getCommentsByTarget(targetType as 'question' | 'answer', parsedTargetId);
        res.json(comments);
    } catch (error) {

        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};