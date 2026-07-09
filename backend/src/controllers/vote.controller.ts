import { Request, Response } from 'express';
import {
    upsertVote,
    removeVote,
    getVoteCounts,
    getUserVote,
} from '../models/vote.model';

export const castVote = async (req: Request, res: Response) => {
    const { target_type, target_id, vote_type } = req.body;
    const userId = req.user!.id;

    // Validate target_type
    if (!['question', 'answer'].includes(target_type)) {
        return res.status(400).json({ error: 'Invalid target_type' });
    }

    // Validate vote_type
    if (vote_type !== 1 && vote_type !== -1) {
        return res.status(400).json({ error: 'vote_type must be 1 (upvote) or -1 (downvote)' });
    }

    const parsedTargetId = Number(target_id);
    if (isNaN(parsedTargetId) || parsedTargetId <= 0) {
        return res.status(400).json({ error: 'target_id must be a positive integer' });
    }

    try {
        const vote = await upsertVote(
            userId,
            target_type as 'question' | 'answer',
            parsedTargetId,
            vote_type
        );
        res.status(200).json(vote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to cast vote' });
    }
};


export const removeVoteHandler = async (req: Request, res: Response) => {
    const { target_type, target_id } = req.params;
    const userId = req.user!.id;

    // 1. Validate target_type is a string and in allowed values
    if (typeof target_type !== 'string' || !['question', 'answer'].includes(target_type)) {
        return res.status(400).json({ error: 'Invalid target_type' });
    }

    // 2. Validate and parse target_id
    const parsedTargetId = Number(target_id);
    if (isNaN(parsedTargetId) || parsedTargetId <= 0) {
        return res.status(400).json({ error: 'target_id must be a positive integer' });
    }

    try {
        // 3. Cast safely (we already validated)
        const deleted = await removeVote(userId, target_type as 'question' | 'answer', parsedTargetId);
        if (!deleted) {
            return res.status(404).json({ error: 'Vote not found' });
        }
        res.json({ message: 'Vote removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove vote' });
    }
};

export const getVoteCountsHandler = async (req: Request, res: Response) => {
    const { target_type, target_id } = req.params;

    if (typeof target_type !== 'string' || !['question', 'answer'].includes(target_type)) {
        return res.status(400).json({ error: 'Invalid target_type' });
    }

    const parsedTargetId = Number(target_id);
    if (isNaN(parsedTargetId) || parsedTargetId <= 0) {
        return res.status(400).json({ error: 'target_id must be a positive integer' });
    }

    try {
        const counts = await getVoteCounts(target_type as 'question' | 'answer', parsedTargetId);
        res.json(counts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get vote counts' });
    }
};

export const getUserVoteHandler = async (req: Request, res: Response) => {
    const { target_type, target_id } = req.params;
    const userId = req.user!.id;

    if (typeof target_type !== 'string' || !['question', 'answer'].includes(target_type)) {
        return res.status(400).json({ error: 'Invalid target_type' });
    }

    const parsedTargetId = Number(target_id);
    if (isNaN(parsedTargetId) || parsedTargetId <= 0) {
        return res.status(400).json({ error: 'target_id must be a positive integer' });
    }

    try {
        const vote = await getUserVote(userId, target_type as 'question' | 'answer', parsedTargetId);
        res.json(vote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user vote' });
    }
};