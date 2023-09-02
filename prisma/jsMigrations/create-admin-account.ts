import PClient from "@prisma/client";
import bcrypt from "bcrypt";

const { PrismaClient } = PClient;
const prisma = new PrismaClient();
const migration = async () => {
 const hashedPassword = await bcrypt.hash("admin", 10);

 await prisma.admin.create({
  data: {
   firstName: "Persona",
   lastName: "Bussiness",
   email: "persona@mailinator.com",
   role: "SUPER_ADMIN",
   password: hashedPassword,
  },
 });
};
migration().then(
 () => {
  console.log("success");
  process.exit(1);
 },
 (e) => {
  console.log(e.message);
  process.exit(2);
 }
);
