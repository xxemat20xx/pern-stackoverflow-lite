
import { User } from '../types/index';
import { prisma } from '../config/prisma';

export const createUser = async (username: string, email: string, hashedPassword: string): Promise<User> => {
    const user = await prisma.user.create({
        data: {
            username,
            email,
            passwordHashed: hashedPassword
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
    return user;
}

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    return user ?? undefined;
}