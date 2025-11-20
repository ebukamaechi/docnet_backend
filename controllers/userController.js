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
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// updating role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated successfully", role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// fetching user profile details
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID required" });
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// deleting user account
exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });
    //delete profile image from cloudinary if exists
    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }
    await User.findByIdAndDelete(userId);
    // logout
    res.clearCookie("login_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// disabling user account
exports.disableUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isDisabled = true;
    await user.save();
    res.status(200).json({ message: "User account disabled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// enabling user account
exports.enableUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isDisabled = false;
    await user.save();
    res.status(200).json({ message: "User account enabled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// listing all users with a specific specialty
exports.getUsersBySpecialty = async (req, res) => {
  try {
    const { specialtyId } = req.params;
    const users = await User.findById(specialtyId).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// updating bio
exports.updateBio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.bio = bio;
    await user.save();
    res.status(200).json({ message: "User bio updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// updating badges based on user activity
exports.updateBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    const { badges } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.badges = badges;
    await user.save();
    res.status(200).json({
      message: "User badges updated successfully",
      badges: user.badges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// updating sociallinks
exports.updateSocialLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    // socialLinks: {twitter: { type: String },facebook: { type: String },},

    const { twitter, facebook, instagram } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.socialLinks.twitter = twitter || user.socialLinks.twitter;
    user.socialLinks.facebook = facebook || user.socialLinks.facebook;
    user.socialLinks.instagram = instagram || user.socialLinks.instagram;
    await user.save();
    res.status(200).json({
      message: "Social links updated successfully",
      socialLinks: user.socialLinks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// adding followers count
// adding following count
// updating unreadMessages map
exports.updateUnreadMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, count } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.unreadMessages.set(conversationId, count);
    await user.save();
    res.status(200).json({
      message: "Unread messages updated",
      unreadMessages: user.unreadMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// search user by username or name
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        // { fullName: { $regex: query, $options: "i" } }, // if your schema uses fullName
      ],
    })
      .select("-password -email -__v") // remove sensitive fields
      .limit(20); // prevent heavy queries

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// any other user-related functionalities
// isOnline status update with lastSeen timestamp using redis/socket.io can be implemented here as needed
