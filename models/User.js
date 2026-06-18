import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    // IMPORTANT: this stores the HASHED password, never plain text.
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// In development, Next.js "hot reloads" files often. Without this check,
// Mongoose would try to redefine the "User" model on every reload and crash.
export default mongoose.models.User || mongoose.model("User", UserSchema);
