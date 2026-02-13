const express = require("express");
const {
  register,
  verifyOTP,
  login,
  logout,
  profile,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const isAuthenticatedUser = require("../Middlewares/auth");

const router = express.Router();

// ! Register API
router.post("/register", register);

// ! Verify - OTP API
router.post("/verifyUser", verifyOTP);

// ! Login User API
router.post("/login", login);

// ! Logout User API
router.get("/logout", logout);

// ! User Profile API
router.get("/profile", isAuthenticatedUser, profile);

// ! Forgot Password API
router.post("/password/forgot", forgotPassword);

// ! Reset Password API
router.put("/password/reset/:token", resetPassword);

module.exports = router;
