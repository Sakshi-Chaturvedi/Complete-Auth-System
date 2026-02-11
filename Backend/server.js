require("dotenv").config();
const app = require("./src/app");
const removeUnverifiedAccounts = require("./src/automation/removeUnverifiedAccounts");
const connectToDB = require("./src/db/db");

(async () => {
  await connectToDB();
  removeUnverifiedAccounts();

  app.listen(3000, () => {
    console.log("Server is running on port : 3000");
  });
})();
