const express = require("express");
const router = require("./routes/auth.routes");
const { errorMiddleware } = require("./Middlewares/error");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [process.env.FrontEnd_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }),
);

app.use(cookieParser);

app.use(express.urlencoded({ extended: true }));

app.use("/auth", router);

app.use(errorMiddleware);

module.exports = app;
