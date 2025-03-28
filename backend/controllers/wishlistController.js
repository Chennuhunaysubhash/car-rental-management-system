import Wishlist from "../models/wishlist.js";

// ✅ Add a car to the wishlist
export const addToWishlist = async (req, res) => {
    try {
      const { carId } = req.body;
      const userId = req.user._id;
  
      const wishlistItem = await Wishlist.findOneAndUpdate(
        { userId, carId }, 
        { userId, carId }, 
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
  
      res.status(201).json({ message: "Car added to wishlist successfully", wishlistItem });
    } catch (error) {
      console.error("Error adding car to wishlist:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  };
  

// ✅ Remove a car from the wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user._id;

    const deletedItem = await Wishlist.findOneAndDelete({ userId, carId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Car not found in wishlist" });
    }

    res.status(200).json({ message: "Car removed from wishlist" });
  } catch (error) {
    console.error("Error removing car from wishlist:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Get all wishlist cars for the logged-in renter
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate carId and then populate owner details inside carId
    const wishlist = await Wishlist.find({ userId })
      .populate({
        path: "carId",
        populate: {
          path: "owner", // Populate owner details from User model
          select: "firstName lastName phoneNumber" // Select required fields from User model
        }
      });

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
