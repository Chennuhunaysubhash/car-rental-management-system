import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/*const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('🔴 No token provided');
      return res.status(401).json({ message: 'No token provided.' });
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded Token:', decoded);

    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('🔴 User not found in database');
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user; // Attach user to request
    console.log('✅ Authenticated User:', user);

    next();
  } catch (error) {
    console.log('🔴 Invalid token:', error.message);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};*/

const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔍 Headers:', req.headers);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('❌ No token received');
      return res.status(401).json({ message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token Decoded:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;
    console.log('✅ Authenticated User:', user);
    next();
  } catch (error) {
    console.log('❌ Token Error:', error.message);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};


export default authMiddleware;
