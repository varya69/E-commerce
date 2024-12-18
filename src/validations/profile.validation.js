const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming you have a custom validation for MongoDB ObjectId

const createOrUpdate = {
  params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  body: Joi.object({
    name: Joi.string().required(),
    mobile: Joi.string().length(10).optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
    dateOfBirth: Joi.date().optional(),
  }),
};

const getProfile = {
  params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
}

const deleteAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().required().length(24).hex(),
    }),
}

const addAddress = {
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
  body: Joi.object({
    label: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    phoneNumber: Joi.string().length(10).required(),
  }),
};

module.exports = {
  createOrUpdate,
  addAddress,
  getProfile,
  deleteAddress
};
