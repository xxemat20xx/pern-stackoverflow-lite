import { pool } from '../config/db';
import { Answer } from '../types/index';

export const createAnswer = async (body: string, questionId: number, authorId: number): Promise<Answer> => {

    const result = await pool.query(
        'INSERT INTO answers (body, question_id, author_id) VALUES ($1, $2, $3) RETURNING *',
        [body, questionId, authorId]
    );
    return result.rows[0];
};

export const getAnswersByQuestion = async (questionId: number): Promise<Answer[]> => {
    // ✅ Notice the JOIN with users to get the username
    const result = await pool.query(`
    SELECT a.*, u.username 
    FROM answers a
    JOIN users u ON a.author_id = u.id
    WHERE a.question_id = $1
    ORDER BY a.created_at ASC
  `, [questionId]);
    return result.rows;
};

export const acceptAnswer = async (answerId: number, userId: number): Promise<Answer | null> => {
    const check = await pool.query(
        `SELECT q.id FROM questions q
         JOIN answers a ON a.question_id = q.id
         WHERE a.id = $1 AND q.author_id = $2
        `,
        [answerId, userId]
    );
    if (check.rows.length === 0) return null;

    const result = await pool.query(
        'UPDATE answers SET is_accepted = TRUE WHERE id =$1 RETURNING *', [answerId]
    );
    return result.rows[0];
};

