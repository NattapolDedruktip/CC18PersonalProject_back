const express = require("express");
const hostRouter = express.Router();
const hostController = require("../controllers/host-controller");
const { authCheck, hostCheck } = require("../middleware/auth");

hostRouter.get("", authCheck, hostCheck, hostController.getHostInfo);

module.exports = hostRouter;
