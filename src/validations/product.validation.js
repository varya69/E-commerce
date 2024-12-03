const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming you have a custom validation for MongoDB ObjectId

const create = {
  body: Joi.object().keys({
    category: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    sku: Joi.string().required(),
    barcode: Joi.string().required(),
    brand: Joi.string().required(),
    vendor: Joi.string().required(),
    stock: Joi.number().integer().required(),
    reserved: Joi.number().integer().optional(),
    taxPercent: Joi.number().required(),
    price: Joi.number().required(),
    thumbnail: Joi.string().required(),
    active: Joi.boolean().required(),
    productImages: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          link: Joi.string().uri().required(),
        })
      )
      .optional(),
    userId: Joi.string().custom(objectId).required(),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      category: Joi.string().optional(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      sku: Joi.string().optional(),
      barcode: Joi.string().optional(),
      brand: Joi.string().optional(),
      vendor: Joi.string().optional(),
      stock: Joi.number().integer().optional(),
      reserved: Joi.number().integer().optional(),
      taxPercent: Joi.number().optional(),
      price: Joi.number().optional(),
      thumbnail: Joi.string().optional(),
      active: Joi.boolean().optional(),
      productImages: Joi.array()
        .items(
          Joi.object().keys({
            name: Joi.string().optional(),
            link: Joi.string().uri().optional(),
          })
        )
        .optional(),
    })
    .min(1), // Ensure at least one field is being updated
};

const getAll = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).optional(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
  }),
};

const getById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

const deleteById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  create,
  update,
  getAll,
  getById,
  deleteById,
};
