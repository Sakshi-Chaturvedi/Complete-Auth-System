require("dotenv").config();
const app = require("./src/app");
const removeUnverifiedAccounts = require("./src/automation/removeUnverifiedAccounts");
const connectToDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

(async () => {
  await connectToDB();
  removeUnverifiedAccounts();

  app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
  });
})();
