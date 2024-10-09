const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth-controller")
// const { auth } = require("../middleware/auth")
const { registerValidator, loginValidator } = require("../middleware/validator")


authRouter.post("/register",registerValidator,authController.register)
authRouter.post("/login",loginValidator,authController.login)




module.exports = authRouter