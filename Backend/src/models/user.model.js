const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: [8, "Password should contain at least 8 characters."],
    maxLength: [12, "Password can not have more than 12 characters."],
    select: false,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  accountVerified: { type: Boolean, default: false },
  verificationCode: {
    type: String,
  },
  verificationCodeExpire: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function () {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  const verificationCode = firstDigit + remainingDigits;

  this.verificationCode = verificationCode;
  this.verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000);

  return verificationCode;
};

const user = mongoose.model("auth", userSchema);

module.exports = user;
