const nodemailer = require("nodemailer");

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "vamaefule9@gmail.com",
        pass: "qwiwtpenquwvfqkd", // Gmail App Password
      },
    });

    await transporter.verify();
    console.log("SMTP connection successful!");
  } catch (err) {
    console.error("SMTP connection failed:", err);
  }
})();
