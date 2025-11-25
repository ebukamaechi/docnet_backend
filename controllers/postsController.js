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

// edit a post
// delete a post
// get a post by id
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
