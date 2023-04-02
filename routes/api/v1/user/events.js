const express = require("express");
const passport = require("passport");
const eventController = require("../../../../controllers/events/events.controller");
const eventsRouter = express.Router();

//? create events
eventsRouter.post(
  "/create-event",
  passport.authenticate("user", { session: false }),
  eventController.createEvent
);
eventsRouter.get(
  "/get-all-events",
  passport.authenticate("user", { session: false }),
  eventController.getAllEvents
);

module.exports = eventsRouter;
