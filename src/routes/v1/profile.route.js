const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const profileController = require('../../controllers/profile.controller');
const profileValidation = require('../../validations/profile.validation');

const router = express.Router();

router.post('/:userId', auth(), validate(profileValidation.createOrUpdate), profileController.createOrUpdateProfile);
router.get('/:userId', auth(), validate(profileValidation.getProfile), profileController.getProfile);
router.post('/addresses/:userId', auth(), validate(profileValidation.addAddress), profileController.addAddress);
router.delete('/addresses/:addressId', auth(), validate(profileValidation.deleteAddress), profileController.deleteAddress);

module.exports = router;
