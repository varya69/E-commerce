const cartService = require('../services/cart.service');

const add = catchAsync(async (req, res) => {
  const result = await cartService.add(req.user.id, req.body.productId, req.body.quantity || 1);
  res.status(httpStatus.CREATED).json({
    message: 'Product added to cart',
    cart: result,
  });
});

const update = catchAsync(async (req, res) => {
  const result = await cartService.update(req.user.id, req.body.productId, req.body.quantity);
  res.status(httpStatus.OK).json({
    message: 'Cart updated successfully',
    cart: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const result = await cartService.remove(req.user.id, req.body.productId);
  res.status(httpStatus.OK).json({
    message: 'Product removed from cart',
    cart: result,
  });
});

const get = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.status(200).send(cart);
});

module.exports = { add, remove, update, get };
