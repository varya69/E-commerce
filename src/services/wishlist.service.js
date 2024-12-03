const Wishlist = require('../models/wishlist.model');

const add = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [] });
  }

  if (wishlist.products.includes(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already in wishlist');
  }

  wishlist.products.push(productId);
  await wishlist.save();
  return wishlist;
};

const remove = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
  }

  wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
  await wishlist.save();
  return wishlist;
};

const getWishlist = async (userId) => {
  return await Wishlist.findOne({ userId }).populate('products.productId');
};

module.exports = { add, remove, getWishlist };
