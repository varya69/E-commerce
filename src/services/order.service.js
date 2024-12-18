const httpStatus = require('http-status');
const { Order, Profile } = require('../models');
const ApiError = require('../utils/ApiError');

const createOrder = async (userId, orderData) => {
  const order = await Order.create({ userId, ...orderData });

  // Link the order to the user's profile
  await Profile.findOneAndUpdate(
    { userId },
    { $push: { orders: order._id } }
  );

  return order;
};

const getOrders = async (userId) => {
  const orders = await Order.find({ userId }).populate('orderItems.productId');
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return orders;
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate('orderItems.productId');
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  console.log("order Data: ", order)
  return order;
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
