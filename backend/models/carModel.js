import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔥 Refers to User model
    brand: { type: String, required: true },
    model: { type: String, required: true },
    carNumber: { type: String, required: true, unique: true },
    availability: { type: Boolean, default: true },
    type: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    year: { type: Number, required: true },
    image: { type: String }, // 🔥 Store Base64 image or URL
    mileage: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Indexing for better search performance
carSchema.index({ brand: "text", model: "text", type: "text" });

const Car = mongoose.model("Car", carSchema);
export default Car;
