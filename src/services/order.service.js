const httpStatus = require('http-status');
const Order = require('../models/order.model');
const Profile = require('../models/profile.model');
const Product = require('../models/products.model');
const ApiError = require('../utils/ApiError');
const productService = require('../services/product.service')
// const createOrder = async (userId, orderData) => {
//   const order = await Order.create({ userId, ...orderData });

//   // Link the order to the user's profile
//   await Profile.findOneAndUpdate(
//     { userId },
//     { $push: { orders: order._id } }
//   );

//   return order;
// };

const validateShippingAddress = async (userId, addressId) => {
  const profile = await Profile.findOne({ userId, 'addresses._id': addressId });
  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid shipping address');
  }
};

const createOrder = async (userId, orderData) => {
  const unavailableItems = [];
  
  // Validate stock for each item
  for (const item of orderData.orderItems) {
    const { productId, quantity } = item;

    try {
      // Verify product stock
      await productService.verifyProductStock(productId, quantity);
    } catch (error) {
      unavailableItems.push({ productId, error: error.message });
    }
  }

  if (unavailableItems.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Some products are unavailable');
  }

  // Continue to create order if all items are valid
  for (const item of orderData.orderItems) {
    await adjustStock(item.productId, item.quantity);
  }

  // const isValidate = await validateShippingAddress(userId, orderData.shippingAddress);
  // if (!isValidate) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Address is not valid');
  // }

  const order = await Order.create({ userId, ...orderData });
  await Profile.findOneAndUpdate(
    { userId },
    { $push: { orders: order._id } }
  );

  return order;
};

// const createOrder = async (userId, orderData) => {
//   const isValidate = await validateShippingAddress(userId, orderData.shippingAddress);
//   if (!isValidate) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Address is not valid');
//   }

//   // Validate stock and adjust it for each item
//   for (const item of orderData.orderItems) {
//     const { productId, quantity } = item;
//     await verifyProductStock(productId, quantity); // Validate stock
//     await adjustStock(productId, quantity);
//   }

//   // Create the order
//   const order = await Order.create({ userId, ...orderData });

//   // Link the order to the user's profile
//   await Profile.findOneAndUpdate(
//     { userId },
//     { $push: { orders: order._id } }
//   );

//   return order;
// };

const getOrders = async (userId) => {
  const orders = await Order.find({ userId });
  if (!orders || orders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No orders found for this user');
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

const adjustStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock');
  }
  
  product.stock -= quantity;
  await product.save();
  return product;
};

const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid order status');
  }

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return order;
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  adjustStock,
};
