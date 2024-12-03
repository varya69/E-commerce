const express = require('express');
const validate = require('../../middlewares/validate');
const cartValidation = require('../../validations/cart.validation');
const cartController = require('../../controllers/cart.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(cartValidation.addToCart), cartController.add)
  .get(auth(), cartController.get);

router
  .delete('/', auth(), validate(cartValidation.removeFromCart), cartController.remove)
  .patch('/', auth(), validate(cartValidation.updateCart), cartController.update);

module.exports = router;
