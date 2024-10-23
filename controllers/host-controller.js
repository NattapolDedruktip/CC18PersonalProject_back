const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");

//step1 at backend upload photo
const cloudinary = require("cloudinary").v2;

module.exports.getHostInfo = async (req, res, next) => {
  try {
    // console.log(req.user.email);
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

module.exports.editHoteDescription = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const description = req.body.description;
    // console.log(id, description);

    const editedDescription = await prisma.hotel.update({
      where: {
        id: Number(id),
      },
      data: {
        description: description,
      },
    });
    res.json(editedDescription);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteHote = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.hotel.delete({
      where: {
        id: Number(id),
      },
    });
    res.json("Delete hote!");
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
    // console.log(id);
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
module.exports.removeHotelPicture = async (req, res, next) => {
  try {
    const formRemove = req.body;
    const id = formRemove.id;
    const publicId = formRemove.public_id;
    console.log(formRemove, "222222222222");
    console.log("Public_Id :", formRemove.public_id);
    // console.log("Id :", formRemove.id);

    //delete in db
    const pic = await prisma.hotelImage.delete({
      where: {
        public_id: publicId,
      },
    });

    // delete in cloudinary
    await cloudinary.uploader.destroy(publicId, function (error, result) {
      if (error) {
        console.log("ERROR", error);
      } else {
        console.log("RESULT", result);
      }
    });

    res.json("Delete successfully!");
  } catch (err) {
    next(err);
  }
};

module.exports.createAvailableTime = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    const newFreeTime = await prisma.availiableTime.create({
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        hotelId: Number(data.hotelId),
        price: Number(data.price),
      },
    });

    res.json(newFreeTime);
  } catch (err) {
    next(err);
  }
};

module.exports.getAvailableTimeByHoteId = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    const freeTime = await prisma.availiableTime.findMany({
      where: {
        hotelId: Number(id),
        isBooking: false,
      },
    });

    res.json(freeTime);
  } catch (err) {
    next(err);
  }
};

module.exports.getAvailableTimeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const freeTime = await prisma.availiableTime.findFirst({
      where: {
        id: Number(id),
      },
    });
    res.json(freeTime);
  } catch (err) {
    next(err);
  }
};

module.exports.removeAvailableTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const latlng = req.body;
    const removedItem = await prisma.availiableTime.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(removedItem);
  } catch (err) {
    next(err);
  }
};

//map api
module.exports.createLatLng = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { latLng } = req.body;

    console.log(typeof latLng.lat, typeof id);

    const newLatLng = await prisma.hotel.update({
      where: {
        id: Number(id),
      },
      data: {
        lat: parseFloat(latLng.lat),
        lng: parseFloat(latLng.lng),
      },
    });

    res.json(newLatLng);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllLatLng = async (req, res, next) => {
  try {
    const AllLatLng = await prisma.hotel.findMany({
      where: {
        lat: {
          not: null,
        },
        lng: {
          not: null,
        },
      },
      select: {
        lat: true,
        lng: true,
        hotelName: true,
        id: true,
      },
    });
    res.json(AllLatLng);
  } catch (err) {
    next(err);
  }
};

//transaction
module.exports.getAllTransaction = async (req, res, next) => {
  try {
    const id = req.user.id;

    const allTransactions = await prisma.transaction.findMany({
      where: {
        status: "UNPAID",
        booking: {
          hotel: {
            userId: id,
          },
        },
      },
      include: {
        booking: {
          include: {
            hotel: true,
          },
        },
      },
    });

    console.log("transacstion", allTransactions);
    res.json(allTransactions);
  } catch (err) {
    next(err);
  }
};

module.exports.confirmTransaction = async (req, res, next) => {
  try {
    const { transactionId, bookingId } = req.body;

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status: "COMPLETE",
      },
    });

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        isPaid: true,
      },
    });

    res.json("confirm transaction");
  } catch (err) {
    next(err);
  }
};

module.exports.cancelTransaction = async (req, res, next) => {
  try {
    const { transactionId, bookingId } = req.body;

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status: "CANCEL",
      },
    });

    // const updatedBooking = await prisma.booking.update({
    //   where: {
    //     id: bookingId,
    //   },
    //   data: {
    //     isPaid: true,
    //   },
    // });

    res.json("confirm transaction");
  } catch (err) {
    next(err);
  }
};

module.exports.getTransactionHistory = async (req, res, next) => {
  try {
    const id = req.user.id;

    const allTransactions = await prisma.transaction.findMany({
      where: {
        status: "COMPLETE",
        booking: {
          hotel: {
            userId: id,
          },
        },
      },
      include: {
        booking: {
          include: {
            hotel: true,
          },
        },
      },
    });

    console.log("transacstion", allTransactions);
    res.json(allTransactions);
  } catch (err) {
    next(err);
  }
};
