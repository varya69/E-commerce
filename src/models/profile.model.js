const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  label: {
    type: String, // Address label (e.g., "Home", "Work")
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 15,
  },
  isDefault: {
    type: Boolean, // Marks the default address
    default: false,
  },
});

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: false,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    profilePicture: {
      type: String, // URL to the profile picture
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    addresses: [AddressSchema], // Array of addresses
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // Links orders associated with the user
      },
    ],
    isProfileComplete: {
      type: Boolean, // Tracks profile completion
      default: false,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;