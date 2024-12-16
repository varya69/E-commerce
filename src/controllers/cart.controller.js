const httpStatus = require('http-status');
const cartService = require('../services/cart.service');
const catchAsync = require('../utils/catchAsync'); // Update the path as per your project structure
const ApiError = require('../utils/ApiError'); // Update the path as per your folder structure
const mongoose = require('mongoose');


const add = catchAsync(async (req, res) => {
  const result = await cartService.add(req.user.id, req.body.productId, req.body.quantity || 1);
  res.status(httpStatus.CREATED).json({
    message: 'Product added to cart',
    cart: result,
  });
});

const update = catchAsync(async (req, res) => {
  const cartId = req.params.cartId || '';
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid cart ID');
  }
  const result = await cartService.update(cartId, req.body.quantity);

  res.sendResponse(result, 'Cart updated successfully', httpStatus.OK);

});

const remove = catchAsync(async (req, res) => {
  const cartId = req.params.cartId || '';
  const result = await cartService.remove(cartId, req.body.productId);

  res.sendResponse(result, 'Product removed from cart', httpStatus.OK);
});

// const getAll = catchAsync(async (req, res) => {
//   const cart = await cartService.getCart(req.user.id);
//   res.status(200).send(cart);
// });

const getAll = catchAsync(async (req, res) => {
  // Conditionally add userId to the filter
  const filter = req.params.userId ? { userId: req.params.userId } : {};

  const options = {
    sortBy: req.query.sortBy, // Default sort order // sort order
    limit: req.query.limit, // maximum results per page
    page: req.query.page, // page number
  };

  // const result = await wishlistService.getWishlist(req.params.userId, options);
  const result = await cartService.getAll(req.user.id, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  res.sendResponse(result, 'Fetched Successfully', httpStatus.OK);
});

module.exports = { add, remove, update, getAll };
