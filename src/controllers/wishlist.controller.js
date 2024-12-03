const wishlistService = require('../services/wishlist.service');

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
  const result = await wishlistService.remove(req.user.id, req.body.productId);
  res.status(httpStatus.OK).json({
    message: 'Product removed from wishlist',
    wishlist: result,
  });
});

const get = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  res.status(200).send(wishlist);
});

module.exports = { add, remove, get };
