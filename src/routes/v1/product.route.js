const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productController = require('../../controllers/product.controller');
const productValidation = require('../../validations/product.validation');

const router = express.Router();

// Create a new product
router.route('/:userId').post(validate(productValidation.create), productController.create);

// Update a product
router.route('/:id').patch(validate(productValidation.update), productController.update);

// Get all products //?sortBy=name:asc&limit=10&page=1
router.get('/getAllProducts/:userId?', validate(productValidation.getAll), productController.getAll);
router.get('/getLowStockProducts/:userId?', validate(productValidation.getLowStockProducts), productController.getLowStockProducts);
router.get('/getProductWithStockStatus/:productId', validate(productValidation.getProductWithStockStatus), productController.getProductWithStockStatus );

// Get & delete a single product by product ID
router
  .route('/:productId')
  .get(validate(productValidation.getById), productController.getById)
  .delete(validate(productValidation.deleteById), productController.deleteById);

module.exports = router;
