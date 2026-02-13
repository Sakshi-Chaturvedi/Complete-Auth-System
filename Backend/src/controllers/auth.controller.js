const catchAsyncError = require("../Middlewares/catchAsyncError");
const { ErrorHandler } = require("../Middlewares/error");
const user = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/sendToken");
const sendVerificationCodeService = require("../utils/sendVerificationCodeService");
const crypto = require("crypto");

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

  const existingUser = await user.findOne({
    $or: [{ email }, { phone }],
    accountVerified: false,
  });

  if (existingUser) {
    return next(new ErrorHandler("Email or Phone already exists.", 400));
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
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged out",
    });
});

// ! User Profile Function
const profile = catchAsyncError(async (req, res, next) => {
  const pUser = req.pUser;

  res.status(200).json({
    success: true,
    message: "User Profile Fetched Successfully.",
    pUser,
  });
});

// ! Forgot Password Function
const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required.", 400));
  }

  const User = await user.findOne({ email, accountVerified: true });

  if (!User) {
    return next(new ErrorHandler("User not Found.", 404));
  }

  const resetToken = User.generateResetPasswordToken();

  await User.save({ validateBeforeSave: false });

  const resetPasswordURL = `${process.env.FrontEnd_URL}/password/reset/${resetToken}`;

  const generateMsg = `Your Reset Password Token is:- \n\n ${resetPasswordURL} \n\n If you have not requested this email then please ignore it.`;

  try {
    sendEmail({
      email,
      subject: "MERN AUTHENTICATION APP RESET PASSWORD",
      message: generateMsg,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${email} successfully.`,
    });
  } catch (error) {
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;

    await User.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(
        error.message ? error.message : "Cannot send reset password token.",
        500,
      ),
    );
  }
});

// ! Reset Password Function
const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new ErrorHandler("Unauthorized Request.", 400));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const r_user = await user.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!r_user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400,
      ),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password & confirm password do not match.", 400),
    );
  }

  r_user.password = req.body.password;
  r_user.resetPasswordToken = undefined;
  r_user.resetPasswordExpire = undefined;
  await r_user.save();

  sendToken(r_user, 200, "Reset Password Successfully.", res);
});

module.exports = {
  register,
  verifyOTP,
  login,
  logout,
  profile,
  forgotPassword,
  resetPassword,
};
