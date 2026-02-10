const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const { ErrorHandler } = require("./error");
const user = require("../models/user.model");

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not Authenticated.", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await user.findById(decoded.id);

  next();
});

module.exports = isAuthenticatedUser;
