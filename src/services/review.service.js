const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const db = require('../models/index');
const Review = require('../models/review.model');
const User = require('../models/user.model');
const Product = require('../models/products.model');

const addReview = async (userId, productId, reviewData) => {
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You have already reviewed this product.');
    }

    const review = await Review.create({ userId, productId, ...reviewData });

    // Optionally: Update product's average rating
    await updateProductAverageRating(productId);

    return review;
};

const getReviewsByProduct = async (userId, productId) => {
    const reviews = await Review.find({ productId }).populate('userId', 'name');
    return reviews;
};


const updateProductAverageRating = async (productId) => {
    const reviews = await Review.find({ productId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, { averageRating });
};

module.exports = { addReview, getReviewsByProduct, updateProductAverageRating };
