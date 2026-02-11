const cron = require("node-cron");
const user = require("../models/user.model");

const removeUnverifiedAccounts = () => {
  cron.schedule("*/30 * * * *", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    await user.deleteMany({
      accountVerified: false,
      createdAt: { $lt: thirtyMinutesAgo },
    });
  });
};

module.exports = removeUnverifiedAccounts;
