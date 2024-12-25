const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming you have a custom validation for MongoDB ObjectId

const createOrder = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object({
    orderItems: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
          quantity: Joi.number().required(),
        })
      )
      .required(),
    totalAmount: Joi.number().required(),
    paymentMethod: Joi.string().valid('Cash_On_Delivery', 'Card_Payment', 'UPI', 'Net_Banking').required(),
    shippingAddress: Joi.string().required(),
  }),
};

const getOrderById = {
  params: Joi.object().keys({
    orderId: Joi.string().required().length(24).hex(),
  }),
};

const updateOrderStatus = {
  params: Joi.object().keys({
    orderId: Joi.string().required().length(24).hex(),
  }),
};

const getOrders = {
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
  query: Joi.object().keys({
    status: Joi.string().valid('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')
  }),
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus
};
