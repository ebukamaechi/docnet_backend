const nodemailer = require("nodemailer");
require("dotenv").config();


const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // must match authenticated user
    to: email,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  });

  console.log(`Email sent to ${email}`);
};


module.exports = sendEmail;
