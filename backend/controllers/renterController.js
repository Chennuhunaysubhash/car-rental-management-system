import Car from "../models/carModel.js";

// 🚘 Get all available cars (with search & pagination)
export const getCars = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Define search criteria
    const searchQuery = search
      ? { 
          $or: [
            { brand: { $regex: search, $options: "i" } },
            { model: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } }
          ] 
        }
      : {};

    const filter = { availability: true, ...searchQuery };

    const cars = await Car.find(filter)
      .populate("owner", "firstName lastName  email phoneNumber") // 🔥 Populate owner details
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCars = await Car.countDocuments(filter);

    res.json({
      cars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later." });
  }
};