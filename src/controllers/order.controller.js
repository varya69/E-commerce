const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
const db = require('../models/index');
const ApiError = require('../utils/ApiError');

const createOrder = catchAsync(async (req, res) => {
  const userId = req.params.userId || req.user.id || '';
  const orderData = req.body;

  const order = await orderService.createOrder(userId, orderData);
  res.sendResponse(order, 'Order placed successfully');
});

const getOrders = catchAsync(async (req, res) => {
  const userId = req.params.userId || req.user.id || '';
  console.log("userId: " + userId)
  const orders = await orderService.getOrders(userId);
  res.sendResponse(orders, 'Orders fetched successfully');
});

const getOrderById = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;

  const order = await orderService.getOrderById(orderId);
  res.sendResponse(order, 'Order details fetched successfully');
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const status = req.query.status;

  const order = await orderService.updateOrderStatus(orderId, status);
  res.sendResponse(order, 'Order updated successfully');
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
