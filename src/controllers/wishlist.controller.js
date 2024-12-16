const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError'); // Update the path as per your folder structure
const wishlistService = require('../services/wishlist.service');
const mongoose = require('mongoose');
const db = require('../models/index');

const catchAsync = require('../utils/catchAsync'); // Update the path as per your project structure

// const add = catchAsync(async (req, res) => {
//   const wishlist = await wishlistService.addToWishlist(req.user.id, req.body.productId);
//   res.status(201).send(wishlist);
// });

// const remove = catchAsync(async (req, res) => {
//   const wishlist = await wishlistService.removeFromWishlist(req.user.id, req.body.productId);
//   res.status(200).send(wishlist);
// });

const add = catchAsync(async (req, res) => {
  const result = await wishlistService.add(req.user.id, req.body.productId);
  
  res.status(httpStatus.CREATED).json({
    message: 'Product added to wishlist',
    wishlist: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const wishlistId = req.params.id; // Ensure the ID is passed as a parameter

  const result = await wishlistService.remove(wishlistId);

  res.sendResponse(result, 'Product removed from wishlist', httpStatus.OK);
});

// const getAll = catchAsync(async (req, res) => {
//   const wishlist = await wishlistService.getWishlist(req.user.id);
//   // res.status(200).send(wishlist);
//   res.status(httpStatus.OK).json({
//     message: 'Get wishlist',
//     wishlist: wishlist,
//   });
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
  const result = await wishlistService.getAll(req.user.id, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
  }

  res.sendResponse(result, 'Fetched Successfully', httpStatus.OK);
});

module.exports = { add, remove, getAll };
