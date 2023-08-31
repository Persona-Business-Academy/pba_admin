import prisma from '../index';

export const findUser = async (email: string) => await prisma.user.findUnique({ where: { email } });
