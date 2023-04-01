require("dotenv").config();
require("app-module-path").addPath(__dirname);
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportJwt = require("./config/passport-jwt-strategy");
const db = require("config/mongoose");
//?

let corsConfig = {
  origin: ["https://btirthorizon.in", "http://localhost:3000"],
  credentials: true,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT,GET,POST,DELETE,PATCH",
};

app.use(cors(corsConfig));

//? setting up bodyparser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setting up passport
app.use(passport.initialize());
app.use(session({ secret: "bla bla bla" }));
app.use(passport.session({}));

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
