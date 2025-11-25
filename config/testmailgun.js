// test-smtp.js
const nodemailer = require("nodemailer");
require("dotenv").config();

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false,
      // auth: {
      //   user: process.env.EMAIL_FROM,
      //   pass: process.env.EMAIL_PASS,
      // },
      auth: {
        user: "amaefulevictor1@sandboxeefe2c4a4eb64ce9b6f3c3b963f32f5b.mailgun.org",
        pass: "_&uPQzw$_.S3X$9",
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("SMTP connection successful!");

    // Send test email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.MAILGUN_SMTP_USER,
      to: "your-test-email@example.com",
      subject: "Test Email from Mailgun SMTP",
      text: "Hello! This is a test email from Mailgun via Nodemailer.",
      html: "<p>Hello! This is a test email from Mailgun via Nodemailer.</p>",
    });

    console.log("Test email sent successfully!");
  } catch (err) {
    console.error("Failed to send test email:", err);
  }
})();
