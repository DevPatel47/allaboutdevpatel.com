import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced"],
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
