import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ✅ Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ✅ User Login
export const login = async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    console.log("Login Attempt:", { userId, role });

    const user = await User.findOne({ userId });
    if (!user) {
      console.log("❌ User not found!");
      return res.status(401).json({ message: "Invalid userId or password." });
    }

    console.log("✅ User found:", user.userId);
    console.log("✅ Stored Hashed Password:", user.password);
    console.log("✅ Entered Password:", password);

    // ✅ Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("❌ Password does not match!");
      return res.status(401).json({ message: "Invalid userId or password." });
    }

    // ✅ Ensure user role matches
    if (user.role !== role) {
      return res.status(403).json({ message: `Unauthorized: You are not a ${role}.` });
    }

    res.json({
      token: generateToken(user._id),
      name: user.firstName,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ User Registration
/*export const register = async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);

    const { firstName, lastName, email, phoneNumber, userId, password, role } = req.body;

    if (!role || !["owner", "renter"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists. Choose a different one." });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      userId,
      password,
      role,
    });

    await newUser.save();
    console.log("✅ User Registered Successfully:", newUser.userId);
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};*/

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Profile (Including Password Change)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, phoneNumber, password, newPassword } = req.body;

    // ✅ Change password if requested
    if (password && newPassword) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

      // ✅ Hash new password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // ✅ Update other fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("❌ Profile Update Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const register = async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);

    const { firstName, lastName, email, phoneNumber, userId, password, role } = req.body;

    if (!role || !["owner", "renter"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists. Choose a different one." });
    }

    // ✅ Hash password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      userId,
      password: hashedPassword,  // ✅ Store hashed password
      role,
    });

    await newUser.save();
    console.log("✅ User Registered Successfully:", newUser.userId);
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
