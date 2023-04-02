Razorpay = require("razorpay");
const request = require("request");
const Payment = require("../../models/payment/payment.schema");
const User = require("../../models/users/user.schema");

async function initiateTransaction(req, res) {
  console.log({ body: req.body });
  const amount = req.body.amount;
  const instance = new Razorpay({
    key_id: "rzp_test_6zXUmNuBDgGVcD",
    key_secret: "92LwBvfVqrKqqVRf2tcg9gcc",
  });

  const payment_capture = 0;
  // const amount = req.body.amount;
  const currency = "INR";
  try {
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: Date.now(),
      payment_capture,
    };
    instance.orders.create(options, async function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
      return res.status(200).json(order);
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
}

async function capturePayment(req, res) {
  let amount = req.body.amount;
  let config = {
    RAZOR_PAY_KEY_ID: "rzp_test_6zXUmNuBDgGVcD",
    RAZOR_PAY_KEY_SECRET: "92LwBvfVqrKqqVRf2tcg9gcc",
  };

  console.log("called");
  console.log("amount", amount);

  try {
    return request(
      {
        method: "POST",
        url: `https://${config.RAZOR_PAY_KEY_ID}:${config.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
        form: {
          amount: amount, // amount == Rs 499 // Same As Order amount
          currency: "INR",
        },
      },
      async function (err, response, body) {
        if (err) {
          console.log("error");
          return res.status(500).json({
            message: "Something Went Wrong",
          });
        }
        if (response.statusCode == 200) {
          console.log("hurrah");
          console.log("Status:", response.statusCode);
          console.log("Headers:", JSON.stringify(response.headers));
          console.log("Response:", body);
          return res.status(200).json(body);
        }
      }
    );
  } catch (err) {
    console.log("error found", err);
    return res.status(500).json({
      error: err,
      message: "Something Went Wrong",
    });
  }
}

async function updateTransaction(req, res) {
  console.log({ body: req.body });
  const { uniqueCode, event, ORDERID, TXNAMOUNT, TXNID, STATUS, type } =
    req.body;
  try {
    const user = await User.findOneAndUpdate(uniqueCode, {
      paymentStatus: "COMPLETED",
    });

    const paymentDetails = await Payment.create({
      user: user,
      uniqueCode: uniqueCode,
      orderId: ORDERID,
      txnAmount: TXNAMOUNT,
      txnStatus: STATUS,
      txnId: TXNID,
      type: type,
      event: event,
    });

    return res.status(200).json(paymentDetails);
  } catch (err) {
    return res.status(500).json({
      error: err,
      message: "Something Went Wrong",
    });
  }
}

module.exports = { initiateTransaction, updateTransaction, capturePayment };
