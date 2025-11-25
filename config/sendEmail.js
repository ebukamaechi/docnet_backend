const nodemailer = require("nodemailer");
require("dotenv").config();


const sendEmail = async ({ email, subject, message }) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST || "smtp.gmail.com",
  //   port: process.env.EMAIL_PORT || 587,
  //   secure: false, // true for 465, false for 587
  //   auth: {
  //     user: process.env.EMAIL_FROM,
  //     pass: process.env.EMAIL_PASS, // Gmail App Password
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });


try {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  });
  console.log(`Email sent to ${email}`);
} catch (err) {
  console.error("Failed to send email:", err);
}


  console.log(`Email sent to ${email}`);
};


module.exports = sendEmail;
