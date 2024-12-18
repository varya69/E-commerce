const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const orderController = require('../../controllers/order.controller');
const orderValidation = require('../../validations/order.validation');

const router = express.Router();

router.post('/:userId', auth(), validate(orderValidation.createOrder), orderController.createOrder);
router.get('/:userId', auth(), validate(orderValidation.getOrders), orderController.getOrders);
router.get('/getOrderById/:orderId', auth(), validate(orderValidation.getOrderById), orderController.getOrderById);

module.exports = router;
