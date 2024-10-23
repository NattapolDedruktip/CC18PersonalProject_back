const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");

//import middleware
const { authCheck } = require("../middleware/auth");

userRouter.get("/", authCheck, userController.getUserInfo);
userRouter.get("/all", authCheck, userController.getAllInfo);
userRouter.post("/profileImage", authCheck, userController.createProfileImage);
userRouter.post(
  "/removeProfileImage",
  authCheck,
  userController.removeProfileImage
);
userRouter.post("/createBooking", authCheck, userController.createBooking);
userRouter.get("/getMybooking", authCheck, userController.getBookingByUserId);
userRouter.post("/uploadSlip", authCheck, userController.uploadSlip);
userRouter.delete(
  "/cancelBooking/:id",
  authCheck,
  userController.cancelBooking
);

userRouter.get(
  "/bookingHistory/:id",
  authCheck,
  userController.getBookingHistory
);

module.exports = userRouter;
