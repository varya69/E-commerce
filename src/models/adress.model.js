const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const addressSchema = mongoose.Schema(
  {
    home_no: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: false,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      required: false,
    },
    type: {
      type: String,
      enum: ['Home', 'Work'],
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
addressSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
