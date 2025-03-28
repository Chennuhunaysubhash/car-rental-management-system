import Car from "../models/carModel.js";

// 🚗 Add a new car with Base64 image storage
export const addCar = async (req, res) => {
  try {
    const { brand, model, carNumber, availability, type, pricePerHour, year, image, mileage, description } = req.body;
    const ownerId = req.user._id;

    const carExists = await Car.findOne({ carNumber });
    if (carExists) return res.status(400).json({ message: "Car already exists!" });

    const newCar = new Car({
      owner: ownerId,
      brand,
      model,
      carNumber,
      availability,
      type,
      pricePerHour,
      year,
      image,
      mileage,
      description,
    });

    await newCar.save();
    res.status(201).json({ message: "Car added successfully!", car: newCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Get all cars for the logged-in owner
export const getOwnerCars = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const cars = await Car.find({ owner: ownerId }).populate("owner", "name email");
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update car details including image
export const updateCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const ownerId = req.user._id;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found!" });

    if (car.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own car!" });
    }

    const updatedCar = await Car.findByIdAndUpdate(carId, req.body, { new: true });
    res.json({ message: "Car updated successfully!", updatedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🗑️ Delete a car
export const deleteCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const ownerId = req.user._id;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found!" });

    if (car.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own car!" });
    }

    await Car.findByIdAndDelete(carId);
    res.json({ message: "Car deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

