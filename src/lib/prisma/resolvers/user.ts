import prisma from "../index";

export const findUser = async (email: string) =>
 await prisma.admin.findUnique({ where: { email } });
