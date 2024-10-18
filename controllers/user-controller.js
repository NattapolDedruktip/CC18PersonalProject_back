const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");
const { auto } = require("async");

//step1 at backend upload photo
const cloudinary = require("cloudinary").v2;

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
        userImage: true,
        imagePublicId: true,
      },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

//step2 cloudinary configuation

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.createProfileImage = async (req, res, next) => {
  try {
    //step 3 get file from front

    const { id } = req.user;
    const image = req.body.image;
    // console.log(image, id);
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `FAKEHOTE-${Date.now()}`,
      resource_type: "auto",
      folder: "FakeHoteCC18",
    });
    const UploadedImage = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        userImage: result.secure_url,
        imagePublicId: result.public_id,
      },
    });

    //need to prisma here to update UserImage DB
    res.json("hello");
  } catch (err) {
    next(err);
  }
};

module.exports.removeProfileImage = async (req, res, next) => {
  try {
    res.json("remove image");
  } catch (err) {
    next(err);
  }
};
