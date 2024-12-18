const profileService = require('../services/profile.service');
const catchAsync = require('../utils/catchAsync');

const createOrUpdateProfile = catchAsync(async (req, res) => {
  const profileData = req.body;
  const userId = req.params.id || req.user.id || '';

  const profile = await profileService.createOrUpdateProfile(userId, profileData);
  res.sendResponse(profile, 'Profile created/updated successfully');
});


// const getProfile = catchAsync(async (req, res) => {
//     const userId = req.user.id;
//     const profile = await Profile.findOne({ userId }).populate("orders").lean();

//     if (!profile) throw new ApiError(404, "Profile not found");

//     res.sendResponse(profile, "Profile fetched successfully.");
// });
const getProfile = catchAsync(async (req, res) => {
  const userId = req.params.id || req.user.id;

  const profile = await profileService.getProfile(userId);
  res.sendResponse(profile, 'Profile fetched successfully');
});

const addAddress = catchAsync(async (req, res) => {
  const userId = req.params.id || req.user.id;
  const addressData = req.body;

  const updatedProfile = await profileService.addAddress(userId, addressData);
  res.sendResponse(updatedProfile, 'Address added successfully');
});

const deleteAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.addressId;

  const updatedProfile = await profileService.deleteAddress(userId, addressId);
  res.sendResponse(updatedProfile, 'Address deleted successfully');
});

module.exports = {
  createOrUpdateProfile,
  getProfile,
  addAddress,
  deleteAddress,
};
