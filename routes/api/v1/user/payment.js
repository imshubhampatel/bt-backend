const express = require("express");
const passport = require("passport");
const paymentController = require("../../../../controllers/make-payment/make_payment.controller");
const paymentRouter = express.Router();

//? making payments

paymentRouter.post(
  "/initiate-transaction",
  passport.authenticate("user", { session: false }),
  paymentController.initiateTransaction
);
paymentRouter.post(
  "/razor_capture/:paymentId",
  passport.authenticate("user", { session: false }),
  paymentController.capturePayment
);
paymentRouter.post(
  "/update-transaction",
  passport.authenticate("user", { session: false }),
  paymentController.updateTransaction
);

module.exports = paymentRouter;
