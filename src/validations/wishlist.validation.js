const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming you have a custom validation for MongoDB ObjectId

const add = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    productId: Joi.string().required().length(24).hex(), // Assuming MongoDB ObjectId
  }),
};

const remove = {
  params: Joi.object().keys({
    wishlistId: Joi.string().required().length(24).hex(),
    // productId: Joi.string().required().length(24).hex(),
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
  add,
  remove,
  getAll
};
