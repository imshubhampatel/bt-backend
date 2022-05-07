const nodemailer = require("nodemailer");

let sendMessage = (email, subject, html) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        type: process.env.TYPE,
        user: process.env.MAIL_SENDER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });

    let mailOptions = {
      from: `Team Join Btirt 🎫 <shubhampatel2024@gmail.com>`,
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
