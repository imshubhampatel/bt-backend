const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const SuperAdmin = require("../models/admins/super-admin.schema");
const Admin = require("../models/admins/admin.schema");
const User = require("../models/users/user.schema");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(
  "super-admin",
  new JwtStrategy(opts, async (jwt_payload, done) => {
    await SuperAdmin.findById({ _id: jwt_payload._id }, (err, superAdmin) => {
      if (err) console.log(err);
      if (superAdmin) {
        return done(null, superAdmin);
      } else {
        return done(null, false);
      }
    });
  })
);

passport.use(
  "user",
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("====> jwtPayload user", jwt_payload);
    User.findById(jwt_payload._id, function (err, user) {
      if (err) console.log(err);
      if (user) return done(null, user);
      else {
        return done(null, false);
      }
    });
  })
);
passport.use(
  "admin",
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("====> jwtPayload", jwt_payload);
    Admin.findById(jwt_payload._id, function (err, admin) {
      if (err) console.log(err);
      if (admin) return done(null, admin._id);
      else {
        return done(null, false);
      }
    });
  })
);
