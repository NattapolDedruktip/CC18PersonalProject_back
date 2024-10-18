const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");

//step1 at backend upload photo
const cloudinary = require("cloudinary").v2;

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
    res.json(host);
  } catch (err) {
    next(err);
  }
};

module.exports.createHote = async (req, res, next) => {
  try {
    const user = req.user;
    const { hotelName, hostContact, address, description } = req.body;
    res.json(user);

    const newHote = await prisma.hotel.create({
      data: {
        hotelName: hotelName,
        hostContact: hostContact,
        address: address,
        description: description,
        userId: user.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllHote = async (req, res, next) => {
  try {
    // console.log("========================================");
    const user = req.user;

    const listHote = await prisma.hotel.findMany({
      where: {
        userId: user.id,
      },
      include: {
        hotelImages: true,
      },
    });

    res.json(listHote);
  } catch (err) {
    next(err);
  }
};

module.exports.getHoteInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const hoteInfo = await prisma.hotel.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        hotelImages: true,
      },
    });

    res.json(hoteInfo);
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

module.exports.createHotePictures = async (req, res, next) => {
  try {
    // console.log(req.body);
    const result = await cloudinary.uploader.upload(req.body.data, {
      public_id: `FAKEHOTE-${Date.now()}`,
      resource_type: "auto",
      folder: "FakeHoteCC18_HostPIC",
    });

    console.log(result);

    const image = await prisma.hotelImage.create({
      data: {
        hotelId: Number(req.body.id),
        url: result.url,
        asset_id: result.asset_id,
        public_id: result.public_id,
        secure_url: result.secure_url,
      },
    });
    res.json({ image });
  } catch (err) {
    next(err);
  }
};
