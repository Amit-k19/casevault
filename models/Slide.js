import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    category: {
      type: String,
      enum: ["Strategy", "Finance", "Marketing", "Social Impact", "General"],
      default: "General",
    },
    previewImage: { type: String, default: "" }, // thumbnail image URL
    slideUrl: { type: String, required: true }, // link to the actual PDF/PPTX
    competitionName: { type: String, default: "" },
    year: { type: Number },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Slide || mongoose.model("Slide", SlideSchema);
