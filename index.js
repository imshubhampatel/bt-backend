require("dotenv").config();
require("app-module-path").addPath(__dirname);
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportJwt = require("./config/passport-jwt-strategy");
const db = require("config/mongoose");
//?

const PORT = process.env.PORT || 5000;
//? setup cors()
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//? setting up bodyparser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setting up passport
app.use(passport.initialize());

// ? setting up routes
app.use("/", require("routes"));

//? listening server on port
app.listen(PORT, function (err) {
  if (err) {
    console.log("error in setting up server", err);
    return;
  }
  console.log(`Sever is running up on port ${PORT} :) `);
});
