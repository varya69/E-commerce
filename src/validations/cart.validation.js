const Joi = require('joi');

const addToCart = {
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(),
    quantity: Joi.number().integer().min(1).default(1), // Ensure quantity is at least 1
  }),
};

const removeFromCart = {
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(),
  }),
};

const updateCart = {
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(),
    quantity: Joi.number().integer().min(1).required(), // Quantity must be specified and valid
  }),
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCart,
};
