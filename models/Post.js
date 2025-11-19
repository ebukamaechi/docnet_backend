import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: [{ type: String, url: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
