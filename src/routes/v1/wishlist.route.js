const express = require('express');
const validate = require('../../middlewares/validate');
const wishlistValidation = require('../../validations/wishlist.validation');
const wishlistController = require('../../controllers/wishlist.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/getAllWishlist/:userId?', auth(), validate(wishlistValidation.getAll), wishlistController.getAll);
router.route('/:userId').post(auth(), validate(wishlistValidation.add), wishlistController.add)
router.delete('/:wishlistId?', auth(), validate(wishlistValidation.remove), wishlistController.remove);

module.exports = router;
