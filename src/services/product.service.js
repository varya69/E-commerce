const httpStatus = require('http-status');
const logger = require('../config/logger');
const { User, Product, Wishlist } = require('../models');
const ApiError = require('../utils/ApiError');
const db = require('../models/index');

/**
 * Create a user
 * @param {Object} productBody
 * @returns {Promise<User>}
 */
const create = async (userId, productBody) => {
  console.log('productBody', productBody);
  return await Product.create(productBody);
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
  // Fetch products and populate the 'wishlisted' flag dynamically
  // const products = await Product.find({}).populate('wishlisted');  // `wishlisted` is a virtual field
  // return products;
  
  // return await Product.paginate(filter, options);
  return await db.Product.paginate(filter, options);
};

const getById = async (id) => {
  return await Product.findById(id);
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

module.exports = {
  create,
  update,
  getAll,
  getById,
  deleteById,
  getProductsWithWishlistStatus
};
