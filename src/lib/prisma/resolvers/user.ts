import prisma from "../index";

export class User {
 static async list(skip: number, take: number) {
  return prisma.user
   .findMany({
    skip,
    take,
    select: {
     id: true,
     email: true,
     firstName: true,
     lastName: true,
     createdAt: true,
    },
   })
   .then((res) => res);
 }

 static async findUserByEmail(email: string) {
  return prisma.admin.findUnique({ where: { email } });
 }
}
