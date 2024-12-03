const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

const create = catchAsync(async (req, res) => {
  const result = await productService.create(req.params.userId, req.body);
  console.log('Product created Response: ', res);
  res.sendResponse(result, 'Product Created Successfully!', httpStatus.CREATED);
});
const update = catchAsync(async (req, res) => {
  const result = await productService.update(req.params.id, req.body);
  res.sendResponse(result, 'Product Updated Successfully!', httpStatus.OK);
});

const getAll = catchAsync(async (req, res) => {
  // Conditionally add userId to the filter
  const filter = req.params.userId ? { userId: req.params.userId } : {};

  const options = {
    sortBy: req.query.sortBy, // sort order
    limit: req.query.limit, // maximum results per page
    page: req.query.page, // page number
  };
  const result = await productService.getAll(filter, options);
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
