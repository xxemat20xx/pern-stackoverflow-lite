import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import type { User } from '../types/index';

declare global {
    namespace Express {
        interface Request {
            user?: User | undefined;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        const result = await pool.query<User>('SELECT id, username, email FROM users WHERE id = $1', [decoded.id]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'User not found' });


        req.user = result.rows[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};