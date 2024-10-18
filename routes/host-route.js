const express = require("express");
const hostRouter = express.Router();
const hostController = require("../controllers/host-controller");
const { authCheck, hostCheck } = require("../middleware/auth");

hostRouter.get("", authCheck, hostCheck, hostController.getHostInfo);
hostRouter.post(
  "/hote/:id",
  authCheck,
  hostCheck,
  hostController.createHotePictures
);
//"http://localhost:8000/host/"
hostRouter.post("/hote", authCheck, hostCheck, hostController.createHote);
hostRouter.get("/getAllHote", authCheck, hostCheck, hostController.getAllHote);
hostRouter.get(
  "/getHoteInfo/:id",
  authCheck,
  hostCheck,
  hostController.getHoteInfo
);
hostRouter.post(
  "/images",
  authCheck,
  hostCheck,
  hostController.createHotePictures
);

module.exports = hostRouter;
