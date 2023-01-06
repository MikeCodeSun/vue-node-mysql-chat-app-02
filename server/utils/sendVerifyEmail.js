const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (to, text) => {
  const transport = nodemailer.createTransport({
    // host: process.env.EMAIL_SERVERCE,
    // port: process.env.EMAIL_PORT,
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.GMAIL_ADDRESS,
    to,
    subject: "verify register account",
    text: `verify code: ${text}`,
  });

  console.log("send ok!");
};
