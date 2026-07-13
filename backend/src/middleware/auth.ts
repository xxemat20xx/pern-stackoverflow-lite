import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import type { User } from '../types/index';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { id: number };


        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                username: true,
                email: true,
                passwordHashed: true,
                reputation: true,
                createdAt: true
            }
        });


        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }


        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};