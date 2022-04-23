const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const SuperAdmin = require("../models/admins/super-admin.schema");
// const Admin = require("../models/admins/admin.schema");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(
  "super-admin",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("====> jwtPayload", jwt_payload);
    await SuperAdmin.findById(jwt_payload._id, function (err, superAdmin) {
      if (err) console.log(err);
      if (superAdmin) {
        return done(null, superAdmin);
      } else {
        return done(null, false);
      }
    }).select("-password");
  })
);

passport.use(
  "admin",
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("====> jwtPayload", jwt_payload);
    Admin.findById(jwt_payload._id, function (err, superAdmin) {
      if (err) console.log(err);
      if (superAdmin) return done(null, superAdmin);
      else {
        return done(null, false);
      }
    });
  })
);
