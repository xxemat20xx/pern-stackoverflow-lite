import { pool } from '../config/db';
import { Comment } from '../types';

export const createComment = async (
    body: string,
    authorId: number,
    targetType: 'question' | 'answer',
    targetId: number,
): Promise<Comment> => {

    const result = await pool.query(
        'INSERT INTO comments (body, author_id, target_type, target_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [body, authorId, targetType, targetId]
    );
    return result.rows[0]
}

export const getCommentsByTarget = async (targetType: 'question' | 'answer', targetId: number): Promise<(Comment & { username: string })[]> => {
    const result = await pool.query(
        `
    SELECT c.*, u.username FROM comments c JOIN users u ON c.author_id = u.id WHERE c.target_type = $1 AND c.target_id = $2 ORDER BY c.created_at ASC
    `, [targetType, targetId]
    );
    return result.rows[0];
}