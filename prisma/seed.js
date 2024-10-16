// Reset seed
//npm run resetDB
//npx prisma db push
//npx prisma db seed

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const hashedPassword = bcrypt.hashSync("123456", 10);

//password 123456
const userData = [
  {
    firstName: "Andy",
    lastName: "Codecamp",
    password: hashedPassword,
    gender: "MALE",
    email: "anddy@gmail.com",
    image: "https://www.svgrepo.com/show/446525/avatar.svg",
    role: "USER",
  },
  {
    firstName: "Bobby",
    lastName: "Codecamp",
    password: hashedPassword,
    gender: "MALE",
    email: "bobby@ggg.gmail.com",
    image: "https://www.svgrepo.com/show/446478/avatar-portrait.svg",
    role: "HOST",
  },
  {
    firstName: "Candy",
    lastName: "Codecamp",
    password: hashedPassword,
    gender: "FEMALE",
    email: "candy@gmail.com",
    image: "https://www.svgrepo.com/show/446491/avatar.svg",
    role: "USER",
  },
  {
    firstName: "Danny",
    lastName: "Codecamp",
    password: hashedPassword,
    gender: "ETC",
    email: "danny@gmail.com",
    image: "https://www.svgrepo.com/show/446490/avatar-portrait.svg",
    role: "HOST",
  },
];

console.log("DB seed ...");

async function run() {
  await prisma.user.createMany({ data: userData });
}

run();
