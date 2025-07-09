import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    theme: {
      type: String,
      trim: true,
      default: "dark",
    },
    font: {
      type: String,
      trim: true,
      default: "Poppins",
    },
    seo: {
      title: {
        type: String,
        trim: true,
        default: "",
      },
      description: {
        type: String,
        trim: true,
        default: "",
      },
      keywords: [
        {
          type: String,
          trim: true,
          efault: "",
        },
      ],
    },
    analytics: {
      googleAnalyticsId: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSetting", siteSettingSchema);
