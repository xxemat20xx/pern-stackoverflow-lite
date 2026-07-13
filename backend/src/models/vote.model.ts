import { pool } from '../config/db';
import { Vote } from "@prisma/client";
import { prisma } from '../config/prisma';

export const upsertVote = async (
    userId: number,
    targetType: 'question' | 'answer',
    targetId: number,
    voteType: -1 | 1
): Promise<Vote> => {
    const vote = await prisma.vote.upsert({
        where: {
            userId_targetType_targetId: {
                userId,
                targetType,
                targetId
            }
        },
        update: {
            voteType
        },
        create: {
            userId,
            targetType,
            targetId,
            voteType
        }
    });

    return vote;
};

export const removeVote = async (
    userId: number,
    targetType: 'question' | 'answer',
    targetId: number
): Promise<boolean> => {
    const result = await prisma.vote.deleteMany({
        where: {
            userId,
            targetType,
            targetId
        }
    })
    return result.count > 0;
};
export const getVoteCounts = async (
    targetType: 'question' | 'answer',
    targetId: number
): Promise<{ upvotes: number; downvotes: number; total: number }> => {
    const result = await prisma.vote.groupBy({
        by: ['voteType'],
        where: {
            targetType,
            targetId
        },
        _count: {
            id: true
        }
    })

    const upvotes = result.find(r => r.voteType === 1)?._count.id || 0;
    const downvotes = result.find(r => r.voteType === -1)?._count.id || 0;

    return { upvotes, downvotes, total: upvotes + downvotes };
};

export const getUserVote = async (
    userId: number,
    targetType: 'question' | 'answer',
    targetId: number
): Promise<{ vote_type: -1 | 1 } | null> => {

    const vote = await prisma.vote.findFirst({
        where: {
            userId,
            targetType,
            targetId
        }
    });

    if (!vote) {
        return null;
    }

    return {
        vote_type: vote.voteType as -1 | 1
    };
};