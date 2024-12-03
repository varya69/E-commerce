const Cart = require('../models/cart.model');

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
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [] });
  }

  const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
  if (existingProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already in cart');
  }

  cart.products.push({ productId, quantity });
  await cart.save();
  return cart;
};

const update = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const product = cart.products.find((p) => p.productId.toString() === productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found in cart');
  }

  product.quantity = quantity;
  await cart.save();
  return cart;
};

const remove = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
  await cart.save();
  return cart;
};

const getCart = async (userId) => {
  return await Cart.findOne({ userId }).populate('items.productId');
};

module.exports = { add, remove, update, getCart };
