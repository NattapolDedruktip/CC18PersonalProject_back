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
    //step1 find user in db
    //step2  is there public id in user ?  if there is  delete that public from cloudinary first
    const { id } = req.user;
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    console.log(user);
    if (user.imagePublicId) {
      //delete in clound
      await cloudinary.uploader.destroy(
        user.imagePublicId,
        function (error, result) {
          if (error) {
            console.log("ERROR", error);
          } else {
            console.log("RESULT", result);
          }
        }
      );
    }
    //step 3 get file from front

    const image = req.body.image;
    // console.log(image, id);
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `FAKEHOTE-${Date.now()}`,
      resource_type: "auto",
      folder: "FakeHoteCC18_USER",
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

    res.json("hello");
  } catch (err) {
    next(err);
  }
};

module.exports.removeProfileImage = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { publicId } = req.body;
    console.log(publicId);

    //delete in db
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        userImage: "",
        imagePublicId: "",
      },
    });

    //delete in cloundinary
    await cloudinary.uploader.destroy(publicId, function (error, result) {
      if (error) {
        console.log("ERROR", error);
      } else {
        console.log("RESULT", result);
      }
    });

    res.json("remove image");
  } catch (err) {
    next(err);
  }
};
