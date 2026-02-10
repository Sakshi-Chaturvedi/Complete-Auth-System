const catchAsyncError = require("../Middlewares/catchAsyncError");
const { ErrorHandler } = require("../Middlewares/error");
const user = require("../models/user.model");
const sendToken = require("../utils/sendToken");
const sendVerificationCodeService = require("../utils/sendVerificationCodeService");

const validatePhone = (phone) => {
  const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const register = catchAsyncError(async (req, res, next) => {
  const { username, email, password, phone, verificationMethod } = req.body;

  if (!username || !email || !password || !phone || !verificationMethod) {
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
    username,
    email,
    password,
    phone,
  });

  const OTP = await newUser.generateVerificationCode();
  console.log("REQ BODY BEFORE SAVE:", req.body);

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

// ! OTP Verification Function

const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  if (phone && !validatePhone(phone)) {
    return next(new ErrorHandler("Invalid Phone Number.", 400));
  }

  const userEntries = await user.find({
    accountVerified: false,
    $or: [email ? { email } : null, phone ? { phone } : null].filter(Boolean),
  });

  if (!userEntries || userEntries.length === 0) {
    return next(new ErrorHandler("User not Found.", 404));
  }

  let users = userEntries[0];

  if (userEntries.length > 1) {
    await user.deleteMany({
      _id: { $ne: users._id },
      $or: [
        { phone, accountVerified: false },
        { email, accountVerified: false },
      ],
    });
  }

  if (String(otp) !== String(users.verificationCode)) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }

  if (Date.now() > new Date(user.verificationCodeExpire).getTime()) {
    return next(new ErrorHandler("OTP has been expired.", 400));
  }

  users.verificationCode = null;
  users.accountVerified = true;
  users.verificationCodeExpire = null;

  await users.save();

  sendToken(users, 200, "Account Verified", res);
});

// ! Login User Function
const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email & Password are required.", 400));
  }

  const _user = await user
    .findOne({
      email,
      accountVerified: true,
    })
    .select("+password");

  if (!_user) {
    return next(new ErrorHandler("User not Found.", 404));
  }

  const isPasswordMatched = await _user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Email or Password.", 400));
  }

  sendToken(_user, 200, "Logged In Successfully", res);
});

// ! Logout User Function
const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()), httpOnly: true })
    .json({
      success: true,
      message: "User logged Out Successfully.",
    });
});

// ! User Profile Function
const profile = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "User Profile Fetched Successfully.",
    user
  });
});

module.exports = { register, verifyOTP, login, logout, profile };
