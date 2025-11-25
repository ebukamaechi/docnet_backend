const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/sendEmail");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // user.otp = otp;
    const otpExpires = Date.now() + 15 * 60 * 1000; //15 mins

    // const 
    const newUser = new User({
      email,
      name,
      password: hashPassword,
      username: `user${Date.now().toString().slice(-5)}`,
      otp,
      otpExpires,
    });
    await newUser.save();
    // const token = jwt.sign(
    //   { id: newUser._id, email: newUser.email, role: newUser.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" }
    // );
    await sendEmail({
      email,
      subject: "Your Signup One-Time Password (OTP)",
      message: `\n\nWelcome to our platform, ${name}! \n\nThank you for signing up with the email: ${email}. We're excited to have you on board! \n\nyour OTP is ${otp}. \n\nPlease use this code to verify your account within the next 5 minutes.\n\nBest regards,\nThe Support Team`,
    });

    res.status(201).json({
      message:
        "User created successfully, please verify your email using the OTP sent.",
      // token,
      // user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Signup failed: ${error.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified === false)
      return res
        .status(401)
        .json({ message: "Please verify your account first" });
    if (user.isDisabled===true)
      return res
        .status(401)
        .json({
          message: "This account has been disabled. Please contact support.",
        });
        const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("login_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Login failed: ${error.message}` });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("login_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Logout failed: ${error.message}` });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = User.findOne({ email });
    if (!email) {
      res.status(404).json({ message: "Email not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; //5 mins
    await user.save();

    //send email function
    await sendEmail({
      email,
      subject: "Your Reset Code",
      message: `\n\nYour password reset code is ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Reset password error: ${error.message}` });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `OTP Verification error: ${error.message}` });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    // const userId = req.user.id;
    const user = await User.findOne({ otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    //send welcome email
    await sendEmail({
      email:user.email,
      subject:"Welcome to Our Platform!",
      message:`Hello ${user.name},\n\nCongratulations! Your account has been successfully verified. We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nThe Support Team`
    });
    res.json({ message: "Account Verified successfully, you can now login" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `OTP Verification error: ${error.message}` });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    if(user.isDisabled===true) return res.status(401).json({message:"This account has been disabled. Please contact support."});
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Could not fetch user: ${error.message}` });
  }
};
