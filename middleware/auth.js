const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const prisma = require("../config/prisma");
const { async } = require("jshint/src/prod-params");

exports.authCheck = async (req, res, next) => {
  try {
    //step 1 check header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return createError(401, "TOKEN is missing!");
    }

    const token = authHeader.split(" ")[1];

    console.log(token);

    //step 2 decode payload

    const decode = jwt.verify(token, process.env.SECRET);

    console.log(decode);

    const user = await prisma.user.findFirst({
      where: {
        id: Number(decode.id),
      },
    });

    if (!user) {
      return createError(401, "TOKEN invalid");
    }

    req.user = user;
    //step 3 next

    next();
  } catch (err) {
    next(err);
  }
};

exports.hostCheck = async (req, res, next) => {
  try {
    const { email } = req.user.email;

    const HostUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!HostUser ?? HostUser.role !== "HOST") {
      return createError(403, "Access Denied");
    }

    next();
  } catch (err) {
    next(err);
    res.status(500).json({ message: "Error HOST access denied" });
  }
};
