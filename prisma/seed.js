// Reset seed
//npm run resetDB
//npx prisma db push
//npx prisma db seed

const bcrypt = require("bcryptjs")
const { PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const hashedPassword = bcrypt.hashSync("123456",10)


//pasword 123456
const userData = [
    {firstName : "Andy",lastName : "Codecamp",password : hashedPassword , gender : "MALE", email : "anddy@ggg.mail" , image : "https://www.svgrepo.com/show/446525/avatar.svg"},
    {firstName : "Bobby",lastName : "Codecamp",password : hashedPassword , gender : "MALE" , email : "bobby@ggg.mail" ,image : "https://www.svgrepo.com/show/446478/avatar-portrait.svg"},
    {firstName : "Candy",lastName : "Codecamp",password : hashedPassword , gender : "FEMALE" , email : "candy@ggg.mail" , image : "https://www.svgrepo.com/show/446491/avatar.svg"},
    {firstName : "Danny",lastName : "Codecamp",password : hashedPassword , gender : "ETC" , email : "danny@ggg.mail" , image : "https://www.svgrepo.com/show/446490/avatar-portrait.svg"},
]


console.log("DB seed ...")

async function run() {
    await prisma.user.createMany({data: userData})
}

run()
