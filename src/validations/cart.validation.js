const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming you have a custom validation for MongoDB ObjectId

const addToCart = {params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(),
    quantity: Joi.number().integer().min(1).default(1), // Ensure quantity is at least 1
  }),
};

const removeFromCart = {
  params: Joi.object().keys({
    cartId: Joi.string().required().length(24).hex(),
  }),
};

const updateCart = {
  params: Joi.object().keys({
    cartId: Joi.string().required().length(24).hex(),
  }),
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(),
    quantity: Joi.number().integer().min(1).required(), // Quantity must be specified and valid
  }),
};

const getAll = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
  }),
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCart,
  getAll
};
