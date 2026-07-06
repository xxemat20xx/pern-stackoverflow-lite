import { pool } from '../config/db';
import { User } from '../types/index';


export const createUser = async (username: string, email: string, hashedPassword: string): Promise<User> => {
    const result = await pool.query<User>(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
    );
    const [user] = result.rows;

    if (!user) {
        throw new Error('Failed to create user');
    }
    return user;
}

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
    const result = await pool.query<User>(
        'SELECT * FROM users WHERE email = $1', [email]
    );
    return result.rows[0];
}