const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Profile = require('../models/profile.model');
const db = require('../models/index');

const createOrUpdateProfile = async (userId, profileData) => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { ...profileData, userId },
    { new: true, upsert: true }
  );
  return profile;
};

const getProfile = async (userId) => {
  const profile = await Profile.findOne({ userId }).populate('orders');
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  return profile;
};

const addAddress = async (userId, addressData) => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $push: { addresses: addressData } },
    { new: true }
  );

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found! Create profile first');
    // throw new Error("Create profile first");
  }
  return profile;
};

const deleteAddress = async (userId, addressId) => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );
  return profile;
};

const updateDefaultAddress = async (userId, addressId, isDefault) => {
  if (isDefault) {
    // Fetch the profile
    const profile = await Profile.find({ userId });

    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
    }
    console.log("profile: ", profile[0])
    // Unset default for all addresses
    profile[0].addresses.forEach((address) => {
      address.isDefault = false;
    });

    // Set the selected address as default
    const addressToUpdate = profile[0].addresses.find(
      (address) => address._id.toString() === addressId
    );

    if (!addressToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
    }

    addressToUpdate.isDefault = isDefault;

    // Save the profile
    await profile[0].save();
    return profile;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid update operation');
};

// const cloudinary = require('cloudinary').v2;

// // Cloudinary config setup (add your own credentials)
// cloudinary.config({
//   cloud_name: 'your-cloud-name',
//   api_key: 'your-api-key',
//   api_secret: 'your-api-secret',
// });

// const uploadImage = async (file) => {
//   // Example: Using Cloudinary
//   const result = await cloudinary.uploader.upload(file.path, {
//     folder: 'ecommerce/images', // Optional folder
//     resource_type: 'image',
//   });

//   return result.secure_url; // Return the uploaded image's URL
// };
const path = require('path');
const fs = require('fs');

const uploadImage = async (file) => {
  const uploadDir = path.join(__dirname, '../uploads/images');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = `${uploadDir}/${file.originalname}`;
  fs.renameSync(file.path, filePath);

  return `/uploads/images/${file.originalname}`; // Adjust this path to match your server setup
};

module.exports = {
  createOrUpdateProfile,
  getProfile,
  addAddress,
  deleteAddress,
  uploadImage,
  updateDefaultAddress
};
