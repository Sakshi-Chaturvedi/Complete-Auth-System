const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
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
    required: true,
    minlength: [8, "Password must have atleast 8 characters."],
    maxlength: [15, "Password can't be have more than 15 characters."],
    select: false,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  accountVerified: { type: Boolean, default: false },
  verificationCode: {
    type: Number,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, 0);

    return parseInt(firstDigit + remainingDigits);
  }

  const verificationCode = generateRandomFiveDigitNumber();

  this.verificationCode = verificationCode;

  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};

const user = mongoose.model("auth", userSchema);

module.exports = user;
