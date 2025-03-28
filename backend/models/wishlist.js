import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  wishlist_id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true }, // Reference to Car
});

// ✅ Default export
const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
