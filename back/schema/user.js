import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});


export default mongoose.model('User', userSchema);

