import Cart from "../models/Cart.js";

/**
 * ✅ Add car to cart
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from authMiddleware
    const { carId } = req.body;

    // Check if car is already in cart
    const existingCartItem = await Cart.findOne({ userId, carId });
    if (existingCartItem) {
      return res.status(400).json({ message: "Car already in cart" });
    }

    const cartItem = new Cart({ userId, carId });
    await cartItem.save();

    res.status(201).json({ message: "Car added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * ✅ Remove car from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from authMiddleware
    const { carId } = req.params;

    const deletedItem = await Cart.findOneAndDelete({ userId, carId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Car not found in cart" });
    }

    res.status(200).json({ message: "Car removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * ✅ Get cart for logged-in renter (Populate car & owner)
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from authMiddleware

    const cart = await Cart.find({ userId })
      .populate({
        path: "carId",
        populate: {
          path: "owner",
          model: "User",
          select: "firstName lastName phoneNumber", // Fetch only required fields
        },
      })
      .exec();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
