import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookieOptions } from '../config/cookieOptions';
import { createUser, findUserByEmail } from '../models/user.model';

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await createUser(username, email, hashed);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '7d'
        });
        res.cookie('token', token, cookieOptions).status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Username or email already exist.' });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid Credentials' });

        const match = await bcrypt.compare(password, user.passwordHashed);
        if (!match) return res.status(401).json({ error: 'Invalid Credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        res.cookie('token', token, cookieOptions).status(200).json({ id: user.id, email: user.email, username: user.username, reputation: user.reputation })
    } catch (error: any) {
        res.status(401).json({ error: error.message || 'Login failed' })
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token').json({ message: 'Logged out' })
}

export const getMe = async (req: Request, res: Response) => {
    res.json(req.user);
}