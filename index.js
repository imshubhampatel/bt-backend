require("dotenv").config();
require("app-module-path").addPath(__dirname);
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const db = require("config/mongoose");
const cors = require("cors");
const app = express();
//?

app.use(cors());
app.use(cookieParser());

//? setting up bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setting up passport
app.use(passport.initialize());

// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   console.log(err, err);
//   res.status(err.status || 500);
//   return res.json({
//     // success: false,
//     message: err.message ? err.message : err,
//   });
// });

// ? setting up routes
app.use("/", require("routes"));

//? listening server on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, function (err) {
  if (err) {
    console.log("error in setting up server", err);
    return;
  }
  console.log(`Sever is running up on port ${PORT} :) `);
});
