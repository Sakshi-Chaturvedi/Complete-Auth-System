const catchAsyncError = require("../Middlewares/catchAsyncError");
const ErrorHandler = require("../Middlewares/error");
const user = require("../models/user.model");
const sendVerificationCodeService = require("../utils/sendVerificationCodeService");

const validatePhone = (phone) => {
  const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const register = catchAsyncError(async (req, res, next) => {
  const { uname, email, password, phone, verificationMethod } = req.body;

  if (!uname || !email || !password || !phone || !verificationMethod) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  if (!validatePhone(phone)) {
    return next(new ErrorHandler("Invalid phone number.", 400));
  }

  const existingUser = await user.find({
    $or: [{ email }, { phone }],
    accountVerified: false,
  });

  if (existingUser.length > 0) {
    return next(new ErrorHandler("User already exists.", 400));
  }

  const attempts = await user.countDocuments({
    $or: [{ email }, { phone }],
    accountVerified: false,
  });

  if (attempts > 3) {
    return next(
      new ErrorHandler("Too many attempts, please try again later.", 429),
    );
  }

  const newUser = await user.create({
    uname,
    email,
    password,
    phone,
  });

  const OTP = await newUser.generateVerificationCode();
  await newUser.save();

  await sendVerificationCodeService(verificationMethod, OTP, email, phone);

  return res.status(201).json({
    success: true,
    message:
      verificationMethod === "email"
        ? `Verification code sent to ${email}`
        : "Verification code sent to your phone",
  });
});

module.exports = { register };
