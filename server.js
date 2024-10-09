require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const notFound = require("./middleware/notFound")
const hdlErr = require("./middleware/hdlErr")
const app = express()


const port = process.env.PORT || 9999

const authRouter = require("./routes/auth-route")
app.use(cors())
app.use(express.json())

app.use(morgan("dev"))

app.use("/auth",authRouter)

app.use("*",notFound)
app.use(hdlErr)



app.listen(port,()=> console.log("Create server at ",port))