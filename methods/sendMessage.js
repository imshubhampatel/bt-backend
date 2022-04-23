const nodemailer = require("nodemailer");

let sendMessage = (email, subject, html) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "shubhampatel2024@gmail.com",
        clientId:
          "70959452920-9ue8k9pk2ondee4kracommpd965r142d.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//04fpbFQuMJi2lCgYIARAAGAQSNwF-L9Irq20EcasGqW3_VNWYH8hZ3i4pkymfsjq-tql_T6pd53ywePpzeggSbLDBKDa2W7TxD8g",
      },
    });

    let mailOptions = {
      from: `BTIRT COLLGE MANAGEMENT SYSTEM 🎫 <shubhampatel2024@gmail.com>`,
      to: email,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        reject(err);
      }
      resolve("Message Send!");
    });
  });
};

module.exports = { sendMessage };
