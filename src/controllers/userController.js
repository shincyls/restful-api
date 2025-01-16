const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Basic CRUD

exports.getAllUsers = async (req, res) => {
  try { 
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const getSingleUser = await User.findById(req.params.id);
    res.status(200).json(getSingleUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  
  const { address, dob, name, password } = req.body;

  if (!address || !dob || !name || !password) {
    return res.status(400).json({ message: 'Address, DOB, Password, and Name are required.', data: JSON.stringify(req.body) });
  } else if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  } else {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
  }

  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Advanced Requirements

exports.userFollow = async (req, res) => {
  try {
    const currentUser = req.user; // Assuming authentication middleware
    const targetUserId = req.params.id;

    // Update current user's following list
    await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: targetUserId } });

    // Update target user's followers list
    await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUser._id } });

    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error });
  }
};

exports.userUnfollow = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetUserId = req.params.id;

    // Update current user's following list
    await User.findByIdAndUpdate(currentUser._id, { $pull: { following: targetUserId } });

    // Update target user's followers list
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUser._id } });

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
};

exports.searchNearbyUsers = async (req, res) => {
  const { latitude, longitude, scale } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required.' });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  // Equitor 0.01 degree is approx 1.1132 km, so we search for users within 1.1132 km radius
  // For backend performance purpose, using simple query for a rough dataset
  // On frontend, use harvesine formula for precise circular radius filter from received data
  // User can or cannot adjust scaling on frontend, but if scaling changed will recall this API
  const range = 0.01 * parseFloat(scale);

  try {
    const nearbyUsers = await User.find({
      latitude: { $gte: lat - range, $lte: lat + range },
      longitude: { $gte: lon - range, $lte: lon + range }
    });
    res.status(200).json(nearbyUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

