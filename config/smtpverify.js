const nodemailer = require("nodemailer");

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     user: "vamaefule9@gmail.com",
      //     pass: "qwiwtpenquwvfqkd", // Gmail App Password
      //   },
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

    await transporter.verify();
    console.log("SMTP connection successful!");
  } catch (err) {
    console.error("SMTP connection failed:", err);
  }
})();
