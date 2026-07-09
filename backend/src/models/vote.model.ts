import { pool } from '../config/db';
import { Vote } from '../types/index';

export const upsertVote = async (
    userId: number,
    targetType: 'question' | 'answer',
    targetId: number,
    voteType: -1 | 1
): Promise<Vote> => {
    // Use ON CONFLICT to update existing vote
    const result = await pool.query<Vote>(
        `
    INSERT INTO votes (user_id, target_type, target_id, vote_type)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, target_type, target_id)
    DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = NOW()
    RETURNING *
    `,
        [userId, targetType, targetId, voteType]
    );
    return result.rows[0]!;
};

export const removeVote = async (
    userId: number,
    targetType: 'question' | 'answer',
    targetId: number
): Promise<boolean> => {
    const result = await pool.query(
        'DELETE FROM votes WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
        [userId, targetType, targetId]
    );
    return (result.rowCount ?? 0) > 0;
};
export const getVoteCounts = async (
    targetType: 'question' | 'answer',
    targetId: number
): Promise<{ upvotes: number; downvotes: number; total: number }> => {
    const result = await pool.query(
        `
    SELECT
      COUNT(*) FILTER (WHERE vote_type = 1) AS upvotes,
      COUNT(*) FILTER (WHERE vote_type = -1) AS downvotes
    FROM votes
    WHERE target_type = $1 AND target_id = $2
    `,
        [targetType, targetId]
    );
    const row = result.rows[0];
    return {
        upvotes: Number(row.upvotes),
        downvotes: Number(row.downvotes),
        total: Number(row.upvotes) + Number(row.downvotes),
    };
};

export const getUserVote = async (
    userId: number,
    targetType: 'question' | 'answer',
    targetId: number
): Promise<{ vote_type: -1 | 1 } | null> => {
    const result = await pool.query<{ vote_type: -1 | 1 }>(
        'SELECT vote_type FROM votes WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
        [userId, targetType, targetId]
    );
    return result.rows[0] || null;
};