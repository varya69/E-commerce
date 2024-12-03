const express = require('express');
const validate = require('../../middlewares/validate');
const wishlistValidation = require('../../validations/wishlist.validation');
const wishlistController = require('../../controllers/wishlist.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(wishlistValidation.addToWishlist), wishlistController.add)
  .delete(auth(), validate(wishlistValidation.removeFromWishlist), wishlistController.remove);

module.exports = router;
