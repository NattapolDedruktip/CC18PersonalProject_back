require("dotenv").config()

const prisma = require("../config/prisma")


async function run() {
    await prisma.$executeRawUnsafe("DROP DATABASE fakeHoteDB")
    await prisma.$executeRawUnsafe("CREATE DATABASE fakeHoteDB")
}

console.log("reset DB...")

run()