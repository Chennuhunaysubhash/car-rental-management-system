import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // ✅ Store hashed password
    role: { type: String, required: true, enum: ["owner", "renter"] },
  },
  { timestamps: true }
);

// ✅ Method to compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("🔹 Entered Password:", enteredPassword);
  console.log("🔹 Stored Hashed Password:", this.password);

  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
