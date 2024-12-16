const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const db = require('../models/index');
const Cart = require('../models/cart.model');
const Product = require('../models/products.model');

// const addToCart = async (userId, productId, quantity = 1) => {
//   let cart = await Cart.findOne({ userId });
//   if (!cart) {
//     cart = await Cart.create({ userId, items: [{ productId, quantity }] });
//   } else {
//     const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       cart.items.push({ productId, quantity });
//     }
//     await cart.save();
//   }
//   return cart;
// };

// const removeFromCart = async (userId, productId) => {
//   const cart = await Cart.findOneAndUpdate(
//     { userId },
//     { $pull: { items: { productId } } },
//     { new: true }
//   );
//   if (!cart) throw new Error('Cart not found');
//   return cart;
// };

// const updateCartItem = async (userId, productId, quantity) => {
//   const cart = await Cart.findOne({ userId });
//   if (!cart) throw new Error('Cart not found');
//   const item = cart.items.find((item) => item.productId.toString() === productId);
//   if (!item) throw new Error('Product not in cart');
//   item.quantity = quantity;
//   await cart.save();
//   return cart;
// };
const add = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product does not exist');
  }

  let cart = await Cart.findOne({ userId, productId });
  if (cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already in cart');
  }
  
  cart = new Cart({ userId, productId, quantity });
  // const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
  // if (existingProduct) {
  // }

  // cart.products.push({ productId, quantity });
  await cart.save();
  return cart;
};

const update = async (cartId, quantity) => {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }
  const cart = await Cart.findOne({ _id: cartId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  cart.quantity = quantity;
  await cart.save();
  return cart;
};

const remove = async (cartId, productId) => {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }
  const cart = await Cart.deleteOne({ _id: cartId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  return cart;
};

const getAll = async (userId, options) => {
  // return await Cart.findOne({ userId }).populate('items.productId');

  const result = await Cart.paginate(
    { userId }, // Filter by userId
    {
      ...options,
      populate: {
        path: 'productId', // Populate the products
        // select: '-__v', // Optionally exclude some fields from the products
      },
    }
  );

  console.log('Carts fetched:', result);
  return result;
};

module.exports = { add, remove, update, getAll };
