import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import dotenv from "dotenv";
dotenv.config();

async function sendTestEmail() {
  try {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });

    const sentFrom = new Sender(
      "MS_zmEbdo@test-yxj6lj92odq4do2r.mlsender.net",
      "Test Sender"
    );

    const recipients = [
      new Recipient("amaechivictor2006@gmail.com", "Test Recipient"),
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("MailerSend Test Email")
      .setHtml("<h1>Hello!</h1><p>This is a test email from MailerSend.</p>")
      .setText("Hello! This is a test email from MailerSend.");

    const response = await mailerSend.email.send(emailParams);

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendTestEmail();
