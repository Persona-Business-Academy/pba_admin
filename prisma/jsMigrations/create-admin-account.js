const PClient = require("@prisma/client");
const bcrypt = require("bcrypt");

const { PrismaClient } = PClient;
const prisma = new PrismaClient();
const migration = async () => {
  const hashedPassword = await bcrypt.hash("1634516345Tt*", 10);

  await prisma.admin.create({
    data: {
      firstName: "Persona",
      lastName: "Bussiness",
      email: "Ceo@pba.am",
      role: "SUPER_ADMIN",
      password: hashedPassword,
    },
  });
};
migration().then(
  () => {
    console.log("Success");
    process.exit(1);
  },
  e => {
    console.log(e.message);
    process.exit(2);
  },
);
