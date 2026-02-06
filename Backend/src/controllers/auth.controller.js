const catchAsyncError = require("../Middlewares/catchAsyncError");
const ErrorHandler = require("../Middlewares/error");
const user = require("../models/user.model");

const validatePhone = (phone) => {
  const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, phone, verificationMethod } = req.body;

  if (!name || !email || !password || !phone || !verificationMethod) {
    return next(new ErrorHandler("All field are required.", 400));
  }

  const isPhoneValidate = validatePhone(phone);

  if (!isPhoneValidate) {
    return next(new ErrorHandler("Invalid Phone Number.", 400));
  }

  const existingUser = await user.find({
    $or: [
      {
        email,
        accountVerified: false,
      },
      {
        phone,
        accountVerified: false,
      },
    ],
  });

  if (existingUser) {
    return next(new ErrorHandler("User already Exists."));
  }

  // ! Check Number of attempts for the otp generation.
  const attempts = await user.countDocuments({
    $or: [{ email }, { phone }],
    accountVerified: false,
  });

  if (attempts > 3) {
    return next(
      new ErrorHandler("Too many attempts ,please try again after 1 hour."),
    );
  }

  const userData = {
    name,
    email,
    password,
    phone,
  };

    const User = await user.create(userData);
    
    const OTP = await user.generateVerificationCode();

    await user.save()

    
});
