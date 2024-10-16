const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");

module.exports.getHostInfo = async (req, res, next) => {
  try {
    console.log(req.user.email);
    const host = await prisma.user.findFirst({
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
    res.json({ host });
  } catch (err) {
    next(err);
  }
};
