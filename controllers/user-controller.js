const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");

module.exports.getUserInfo = async (req, res, next) => {
  try {
    console.log(req.user.email);
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
      },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllInfo = async (req, res, next) => {
  try {
    console.log(req.user.email);
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        dateOfBirth: true,
        gender: true,
        paymentMethod: true,
        image: true,
      },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
