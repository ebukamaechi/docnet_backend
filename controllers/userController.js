const User = require("../models/User");
// const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

// Import the same medicalSpecialties array used in your schema
const { medicalSpecialties } = require("../models/User");

// Update user specialty
exports.updateSpecialty = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { specialty } = req.body;

    if (!specialty) {
      return res.status(400).json({ message: "Specialty is required." });
    }

    // Validate specialty
    if (!medicalSpecialties.includes(specialty)) {
      return res.status(400).json({
        message: "Invalid specialty selected.",
        allowedSpecialties: medicalSpecialties,
      });
    }

    // Update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { specialty },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Specialty updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating specialty:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

//check specialtyController.js
// exports.getMedicalSpecialties = async (req, res) => {
//   try {
//     return res.status(200).json({
//       message: "Medical specialties fetched successfully.",
//       specialties: medicalSpecialties,
//     });
//   } catch (error) {
//     console.error("Error fetching specialties:", error);
//     return res.status(500).json({ message: "Server error." });
//   }
// };

// upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(userId);

    if (user.profileImage?.public_id) {
      //delete old image
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_pictures",
          transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "face" },
            { radius: "max" },
          ],
        },
        (error, uploaded) => {
          if (error) reject(error);
          else resolve(uploaded);
        }
      );
      stream.end(req.file.buffer);
    });

    user.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    await user.save();
    return res.status(200).json({
      message: "Profile picture updated",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server upload error: ${error.message}` });
  }
};
// update username...making sure it's unique and not used by another user
exports.updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId)
      return res.status(400).json({ message: "Username already taken" });

    const user = await User.findById(userId);
    //generate a unique username as a fallback
    user.username = username || `user${Date.now().toString().slice(-5)}`;
    await user.save();
    return res.status(200).json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// updating name
exports.updateName = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name;
    await user.save();
    res.status(200).json({ message: "name updated successfully", name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// changing password
// updating role

// fetching user profile details
exports.getUserDetails = async (req, res) => {
  try {
    const {userId}=req.params;
    if(!userId) return res.status(400).json({message:"User ID required"});
    const user = await User.findById(userId).select("-password");
    if(!user) return res.status(404).json({message:"User not found"});
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// deleting user account
// listing all users with a specific specialty
// updating bio
// updating badges based on user activity
// updating sociallinks
// adding followers count
// adding following count
// updating unreadMessages map
// any other user-related functionalities
