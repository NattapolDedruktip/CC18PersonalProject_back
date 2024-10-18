const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");

//import middleware
const { authCheck } = require("../middleware/auth");

userRouter.get("/", authCheck, userController.getUserInfo);
userRouter.get("/all", authCheck, userController.getAllInfo);
userRouter.post("/profileImage", authCheck, userController.createProfileImage);
userRouter.delete(
  "/profileImage",
  authCheck,
  userController.removeProfileImage
);

module.exports = userRouter;
