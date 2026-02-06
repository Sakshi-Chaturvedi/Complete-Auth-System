const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Radhe Radhe");
});

module.exports = router;
