// const nodemailer = require("nodemailer");
// require("dotenv").config();


// const sendEmail = async ({ email, subject, message }) => {
//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.EMAIL_HOST || "smtp.gmail.com",
//   //   port: process.env.EMAIL_PORT || 587,
//   //   secure: false, // true for 465, false for 587
//   //   auth: {
//   //     user: process.env.EMAIL_FROM,
//   //     pass: process.env.EMAIL_PASS, // Gmail App Password
//   //   },
//   // });

//   const transporter = nodemailer.createTransport({
//     host: "smtp.mailgun.org",
//     port: 587,
//     secure: false,
//     // auth: {
//     //   user: process.env.EMAIL_FROM,
//     //   pass: process.env.EMAIL_PASS,
//     // },
//     auth: {
//       user: "amaefulevictor1@sandboxeefe2c4a4eb64ce9b6f3c3b963f32f5b.mailgun.org",
//       pass: "_&uPQzw$_.S3X$9",
//     },
//   });


// try {
//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject,
//     text: message,
//     html: `<p>${message}</p>`,
//   });
//   console.log(`Email sent to ${email}`);
// } catch (err) {
//   console.error("Failed to send email:", err);
// }


//   console.log(`Email sent to ${email}`);
// };


// module.exports = sendEmail;


const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

async function sendEmail({ email, subject, message }) {
  try {
    const sentFrom = new Sender(process.env.EMAIL_FROM, "DocNet Support");

    const recipients = [new Recipient(email, "User")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(`<p>${message}</p>`)
      .setText(message);

    await mailerSend.email.send(emailParams);

    console.log("Email sent to", email);
    return true;
  } catch (error) {
    console.error("MailerSend error:", error);
    return false;
  }
}

module.exports = sendEmail;
