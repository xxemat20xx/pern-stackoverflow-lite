import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'strict' or 'lax' based on preference
    maxAge: 24 * 60 * 60 * 1000,
};