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
hostRouter.patch(
  "/hote/:id",
  authCheck,
  hostCheck,
  hostController.editHoteDescription
);
hostRouter.delete(
  "/removeHote/:id",
  authCheck,
  hostCheck,
  hostController.deleteHote
);
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
hostRouter.post(
  "/removeImage",
  authCheck,
  hostCheck,
  hostController.removeHotelPicture
);

hostRouter.post(
  "/createAvailableTime",
  authCheck,
  hostCheck,
  hostController.createAvailableTime
);

hostRouter.get(
  "/getHoteAvailableTime/:id",
  authCheck,

  hostController.getAvailableTimeByHoteId
);

hostRouter.get(
  "/getHoteAvailableTimeById/:id",
  authCheck,

  hostController.getAvailableTimeById
);

hostRouter.delete(
  "/removeAvailableTime/:id",
  authCheck,
  hostCheck,
  hostController.removeAvailableTime
);

//map
hostRouter.patch(
  "/hote/createLatLng/:id",
  authCheck,
  hostCheck,
  hostController.createLatLng
);

hostRouter.get(
  "/hote/getAllLatLng",
  authCheck,
  hostCheck,
  hostController.getAllLatLng
);

//transaction
hostRouter.get(
  "/getAllTransactions",
  authCheck,
  hostCheck,
  hostController.getAllTransaction
);
hostRouter.patch(
  "/confirmTransaction",
  authCheck,
  hostCheck,
  hostController.confirmTransaction
);
hostRouter.patch(
  "/cancelTransaction",
  authCheck,
  hostCheck,
  hostController.cancelTransaction
);

hostRouter.get(
  "/transactionHistory",
  authCheck,
  hostCheck,
  hostController.getTransactionHistory
);

module.exports = hostRouter;
