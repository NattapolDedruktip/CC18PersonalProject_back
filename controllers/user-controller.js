const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");

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
    console.log("check email", req.user.email);
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
    console.log(user);
    res.json(user);
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

module.exports.editProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = req.body;
    // console.log(id);
    // console.log(form);

    const newProfile = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        paymentMethod: form.paymentMethod,
      },
    });
    res.json(newProfile);
  } catch (err) {
    next(err);
  }
};

//booking
module.exports.createBooking = async (req, res, next) => {
  try {
    const { hotelId, price, id } = req.body;
    // console.log(availableTimeItem);

    // find first  if there is  id     then edit status
    const findAvailableTime = await prisma.booking.findFirst({
      where: {
        availiableTimeId: Number(id),
      },
    });

    if (findAvailableTime) {
      const updateBooking = await prisma.booking.update({
        where: {
          id: findAvailableTime.id,
        },
        data: {
          price: price,
          hotelId: hotelId,
          availiableTimeId: id,
          userId: req.user.id,
          isBook: true,
        },
      });
    } else {
      //createBooking
      console.log(id);
      const newBooking = await prisma.booking.create({
        data: {
          price: price,
          hotelId: hotelId,
          availiableTimeId: id,
          userId: req.user.id,
          isBook: true,
        },
      });
    }
    //change status availiableTime
    const updateAvailiableTime = await prisma.availiableTime.update({
      where: {
        id: id,
      },
      data: {
        isBooking: true,
      },
    });

    // console.log(newBooking);
    // console.log(updateAvailiableTime);
    res.json("hello");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getBookingByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const myBooking = await prisma.booking.findMany({
      where: {
        userId: userId,
        isSlipSend: false,
        isBook: true,
      },
      include: {
        availiableTime: true,
        hotel: {
          include: {
            hotelImages: true,
          },
        },
      },
    });

    res.json(myBooking);
  } catch (err) {
    next(err);
  }
};

module.exports.uploadSlip = async (req, res, next) => {
  try {
    // console.log(req.body.bookingId, req.body.netSpend);
    const image = req.body.image;
    const booking_Id = req.body.bookingId;
    // const booking_Id = 2;
    const netSpend = req.body.netSpend;
    // console.log(image, id);
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `SLIPIMAGE-${Date.now()}`,
      resource_type: "auto",
      folder: "FakeHoteCC18_SLIPIMAGE",
    });

    // console.log(888888);
    console.log(result);
    const newUploadSlip = await prisma.transaction.create({
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
        netSpend: Number(netSpend),
        booking_id: booking_Id,
      },
    });
    console.log(999999999);
    const newBookingStatus = await prisma.booking.update({
      where: {
        id: booking_Id,
      },
      data: {
        isSlipSend: true,
      },
    });
    res.json("susccues");
  } catch (err) {
    next(err);
  }
};

module.exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    const newStatusBooking = await prisma.booking.update({
      where: {
        id: Number(id),
      },
      data: {
        isBook: false,
      },
    });

    const newStatusAvailableTime = await prisma.availiableTime.update({
      where: {
        id: newStatusBooking.availiableTimeId,
      },
      data: {
        isBooking: false,
      },
    });

    res.json("cancel Booking");
  } catch (err) {
    next(err);
  }
};

//history

module.exports.getBookingHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const bookingHistory = await prisma.booking.findMany({
      where: {
        userId: Number(id),
        isPaid: true,
        isBook: true,
        isSlipSend: true,
      },
      include: {
        hotel: {
          include: {
            hotelImages: true, // Include hotelImages related to each hotel
          },
        },
        availiableTime: true, // Include AvailiableTime associated with the booking
      },
    });

    res.json(bookingHistory);
  } catch (err) {
    next(err);
  }
};
