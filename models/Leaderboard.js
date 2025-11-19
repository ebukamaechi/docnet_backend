import mongoose from "mongoose";
const leaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    achievements: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
