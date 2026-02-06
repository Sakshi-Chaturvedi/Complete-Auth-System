const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Server Connected to DB Successfully ✅");
  } catch (error) {
    console.log("Failed To connect with DB", error);
  }
};

module.exports = connectToDB;
