const httpStatus = require('http-status');
const logger = require('../config/logger');
const { User, Product, Wishlist } = require('../models');
const ApiError = require('../utils/ApiError');
const db = require('../models/index');
const wishlistService = require('../services/wishlist.service');

/**
 * Create a user
 * @param {Object} productBody
 * @returns {Promise<User>}
 */
const create = async (userId, productBody) => {
  console.log('productBody', productBody);
  // Attach admin's userId to the product
  const productData = { ...productBody, createdBy: userId };
  return await db.Product.create(productData);
};

const update = async (productId, updateBody) => {
  console.log('updateBody', updateBody);
  const product = await getById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  console.log(product);
  Object.assign(product, updateBody);
  console.log(product, updateBody);
  await product.save();
  return product;
};
// const getAll = async ( options) => {
//     return await Product.paginate( options)
// };
const getAll = async (filter, options) => {
  return await db.Product.paginate(filter, options);
};


const getById = async (productId) => {
  // return await Product.findById(id);
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return {
    ...product.toObject(),
    isInStock: product.stock > 0,
  };
};

const deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const getProductsWithWishlistStatus = async (userId, options) => {
  const { page = 1, limit = 10, sortBy = 'createdAt:desc' } = options;

  const skip = (page - 1) * limit; // Calculate offset for pagination
  const [sortField, sortOrder] = sortBy.split(':');

  const productsWithWishlistStatus = await Product.aggregate([
    {
      $lookup: {
        from: 'wishlists', // MongoDB collection name of Wishlist
        localField: '_id', // Product `_id` field
        foreignField: 'products', // Wishlist's `products` array field
        as: 'wishlistedData', // Temporary field
      },
    },
    {
      $addFields: {
        wishlisted: {
          $cond: [
            {
              $and: [
                { $gt: [{ $size: '$wishlistedData' }, 0] },
                { $in: [userId, '$wishlistedData.userId'] },
              ],
            },
            true,
            false,
          ],
        },
      },
    },
    {
      $project: {
        wishlistedData: 0, // Exclude the temporary field
      },
    },
    { $sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 } }, // Sorting
    { $skip: skip }, // Pagination offset
    { $limit: parseInt(limit, 10) }, // Limit per page
  ]);

  const totalProducts = await Product.countDocuments(); // Total product count for pagination metadata

  return {
    results: productsWithWishlistStatus.map((product) => ({
      ...product,
      wishlisted: product.wishlisted || false, // Explicitly set wishlisted to false
    })),
    page,
    limit,
    totalPages: Math.ceil(totalProducts / limit),
    totalResults: totalProducts,
  };
};

const getLowStockProducts = async (userId, threshold) => {
  const products = await Product.find({
    userId, // Ensure products are filtered by user
    stock: { $lte: threshold }, // Find products where stock is less than or equal to the threshold
  });

  return products;
};

const verifyProductStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product is out of stock or insufficient stock');
  }

  return product;
};

const getProductWithStockStatus = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const isInStock = product.stock > 0;

  return {
    ...product.toObject(),
    isInStock,
  };
};

const getRelatedProducts = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Fetch other products in the same category
  const relatedProducts = await Product.find({ 
    category: product.category, 
    _id: { $ne: productId } 
  }).limit(5);

  return relatedProducts;
};

// const getProductsWithoutReviews = async () => {
//   const products = await Product.find({ reviews: [] });
//   return products;
// };

module.exports = {
  create,
  update,
  getAll,
  getById,
  deleteById,
  getProductsWithWishlistStatus,
  getLowStockProducts,
  verifyProductStock,
  getProductWithStockStatus,
  getRelatedProducts
};
