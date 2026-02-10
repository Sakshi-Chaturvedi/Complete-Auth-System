const express = require("express");
const { register, verifyOTP } = require("../controllers/auth.controller");

const router = express.Router();

// ! Register API
router.post("/register", register);

// ! Verify - OTP API
router.post("/verifyUser", verifyOTP);

module.exports = router;
