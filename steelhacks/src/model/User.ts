import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profile: {
    Name: String,
    Pronouns: String,
    Location: String,
    Bio: String,
  },
}, { timestamps: true });

const User = models.User || mongoose.model("User", userSchema);
export default User;
