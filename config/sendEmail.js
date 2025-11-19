// const nodemailer = require("nodemailer");
// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

const sendEmail = async({email, subject, message})=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_FROM,
            pass:process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from:process.env.EMAIL_FROM,
        to:email,
        subject,
        text:message,
    });
};

export default sendEmail;
