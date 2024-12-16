const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError'); // Update the path as per your folder structure
const Wishlist = require('../models/wishlist.model');
const Product = require('../models/products.model');
const db = require('../models/index');

const add = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product does not exist');
  }

  // Check if product already in wishlist

  let wishlist = await Wishlist.findOne({ userId, productId })
  if (wishlist){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already in wishlist');
  }

  wishlist = new Wishlist({ userId, productId });

  // Add product to the wishlist
  // await wishlist.addProduct(productId);

  // wishlist.products.push(productId);
  await wishlist.save();
  return wishlist;
};

const remove = async (wishlistId) => {
  // Ensure that the wishlistId is valid
  if (!wishlistId) {
    throw new Error("Wishlist ID is required");
  }
  // const wishlist = await Wishlist.remove({ wishlistId });
  const wishlist = await Wishlist.deleteOne({ _id: wishlistId });
  console.log("wishlistId received:", wishlistId);
  
  // await wishlist.save();
  return wishlist;
};

// const getWishlist = async (userId) => {
//   return await Wishlist.find({ userId }).populate('products.productId');
// };

const getAll = async (userId, options) => {
  // return await Wishlist.paginate(filter, options);
  // Use the Wishlist model to query the database
  
  // Use pagination with populate
  const result = await Wishlist.paginate(
    { userId }, // Filter by userId
    {
      ...options,
      populate: {
        path: 'productId', // Populate the products
        // select: '-__v', // Optionally exclude some fields from the products
      },
    }
  );

  return result;
};

module.exports = { add, remove, getAll };
