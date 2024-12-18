const Profile = require('../models/profile.model');

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
    throw new Error('Profile not found');
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
    throw new Error("Create profile first");
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

module.exports = {
  createOrUpdateProfile,
  getProfile,
  addAddress,
  deleteAddress,
};
