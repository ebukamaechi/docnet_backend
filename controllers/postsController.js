const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// create a new post
exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, tags } = req.body;

    let media = [];
    let parsedTags = [];

    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else {
        try {
          // Try JSON parse first
          parsedTags = JSON.parse(tags);
        } catch {
          // Fallback: split comma-separated string
          parsedTags = tags.split(",").map((t) => t.trim());
        }
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

        media.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      }
    }

    const post = new Post({
      title,
      content,
      media,
      author: userId,
      tags: parsedTags,
    });

    await post.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// edit/update a post
exports.editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content, tags, removeMedia } = req.body;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Authorization check (owner or admin)
    if (post.author.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    // --- Parse incoming tags ---
    let parsedTags = post.tags; // fallback to existing
    if (tags) {
      try {
        parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map((t) => t.trim());
      }
    }

    // --- Remove selected media ---
    if (removeMedia) {
      let mediaToRemove = [];

      try {
        mediaToRemove = Array.isArray(removeMedia)
          ? removeMedia
          : JSON.parse(removeMedia);
      } catch {
        mediaToRemove = removeMedia.split(",");
      }

      for (const public_id of mediaToRemove) {
        try {
          await cloudinary.uploader.destroy(public_id);
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }

        // Remove from post.media array
        post.media = post.media.filter((m) => m.public_id !== public_id);
      }
    }

    // --- Upload new media (if any) ---
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

        post.media.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      }
    }

    // --- Update text fields ---
    if (title) post.title = title;
    if (content) post.content = content;
    post.tags = parsedTags;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// delete a post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Authorization: Only the owner or an admin can delete
    if (post.author.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete media from Cloudinary (if any)
    if (post.media && post.media.length > 0) {
      for (const file of post.media) {
        try {
          await cloudinary.uploader.destroy(file.public_id);
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }
      }
    }

    // Delete the post from database
    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// get a post by id
exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
// get all posts with pagination and filtering
// like/unlike a post
// comment on a post
// upvote/downvote a comment
// delete comment
// get posts by a specific user
// get posts by tag
// search posts by keyword
// get trending posts
// get recent posts
// get posts with most comments
// get posts with most likes
