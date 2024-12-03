const Joi = require('joi');

const addToWishlist = {
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(), // Assuming MongoDB ObjectId
  }),
};

const removeFromWishlist = {
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(),
  }),
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
};
