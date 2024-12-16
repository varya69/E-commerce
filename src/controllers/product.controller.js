const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

const create = catchAsync(async (req, res) => {
  const result = await productService.create(req.params.userId, req.body);
  console.log('Product created Response: ', result);
  res.sendResponse(result, 'Product Created Successfully!', httpStatus.CREATED);
});

const update = catchAsync(async (req, res) => {
  const result = await productService.update(req.params.id, req.body);
  res.sendResponse(result, 'Product Updated Successfully!', httpStatus.OK);
});

const getAll = catchAsync(async (req, res) => {
  // Conditionally add userId to the filter
  const filter = req.params.userId ? { userId: req.params.userId } : {};
  console.log('filter user data', req.user);
  const options = {
    sortBy: req.query.sortBy || 'createdAt:desc', // Default to createdAt descending
    limit: parseInt(req.query.limit, 10) || 10, // Default to 10 results per page
    page: parseInt(req.query.page, 10) || 1, // Default to the first page
  };

  const result = await productService.getAll(filter, options);
  // const products = await productService.getProductsWithWishlistStatus(req.params.userId, options);

  console.log('controller product get all response', result);
  // const result = await productService.getAll(options);
  res.sendResponse(result, 'Fetched Successfully', httpStatus.OK);
});

const getById = catchAsync(async (req, res) => {
  const result = await productService.getById(req.params.productId);
  res.sendResponse(result, 'Fetched Successfully', httpStatus.OK);
});

const deleteById = catchAsync(async (req, res) => {
  const result = await productService.deleteById(req.params.productId);
  res.sendResponse(result, 'Deleted Successfully', httpStatus.OK);
});

module.exports = {
  create,
  getAll,
  getById,
  deleteById,
  update,
};
