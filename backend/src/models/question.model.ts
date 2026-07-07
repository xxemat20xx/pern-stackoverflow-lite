import { pool } from '../config/db';
import { Question } from '../types/index';

export const createQuestion = async (title: string, body: string, authorId: number): Promise<Question> => {
    const result = await pool.query('INSERT INTO questions (title, body, author_id) VALUES ($1, $2, $3)',
        [title, body, authorId]
    );

    return result.rows[0];
};

export const getAllQuestions = async (): Promise<(Question & { username: string; answer_count: number })[]> => {
    const result = await pool.query(`
        SELECT q.*, u.username,
        (SELECT COUNT(*) FROM answers WHERE question_id = q.id) AS answer_count
        FROM questions q
        JOIN users u ON q.author_id = u.id
        ORDER BY q.created_at DESC
        `)

    return result.rows;
};

export const getQuestionById = async (id: number): Promise<(Question & { username: string }) | undefined> => {
    const result = await pool.query(`
          SELECT q.*, u.username
          FROM questions q
          JOIN users u ON q.author_id = u.id
          WHERE q.id = $1
    `, [id])

    return result.rows[0];
};