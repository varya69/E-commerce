const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');
const wishlistService = require('../services/wishlist.service');
const db = require('../models/index');


const create = catchAsync(async (req, res) => {
  console.log("userId:", req.params.userId);
  const user = await db.User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }

  const result = await productService.create(req.params.userId, req.body);
  console.log('Product created Response: ', result);
  res.sendResponse(result, 'Product Created Successfully!', httpStatus.CREATED);
});

const update = catchAsync(async (req, res) => {
  const result = await productService.update(req.params.id, req.body);
  res.sendResponse(result, 'Product Updated Successfully!', httpStatus.OK);
});

const getAll = catchAsync(async (req, res) => {

  const { category, minPrice, maxPrice, brand, search } = req.query;

  // Build a dynamic filter
  const filter = {};
  // if(userId) filter.userId = req.params.userId ? { userId: req.params.userId } : {};
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
  }

  // Set pagination options
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 500,
    sort: { createdAt: -1 }, // Sort by newest first
  };

  const products = await productService.getAll(filter, options);

  const userId = req.params.userId; // Extract userId from route params
  if (userId) {
    // Fetch the user's wishlist
    const wishlist = await wishlistService.getAll(userId);
    console.log("wishlist: ", wishlist);
    if (wishlist.results.length > 0) {
      // Extract product IDs from the wishlist
      const wishlistedProductIds = wishlist.results.map((item) => item.productId.id.toString());

      // Add `isWishlisted` flag to each product
      products.results = products.results.map((product) => ({
        ...product.toObject(), // Convert Mongoose object to plain JS object
        isWishlisted: wishlistedProductIds.includes(product._id.toString()), // Check if product is wishlisted
      }));
    }
  }
  res.sendResponse(products, "Products fetched successfully", httpStatus.OK);
});

// const getAll = catchAsync(async (req, res) => {
//   // Conditionally add userId to the filter
//   const filter = req.params.userId ? { userId: req.params.userId } : {};

//   const options = {
//     sortBy: req.query.sortBy || 'createdAt:desc', // Default to createdAt descending
//     limit: parseInt(req.query.limit, 10) || 500, // Default to 10 results per page
//     page: parseInt(req.query.page, 10) || 1, // Default to the first page
//   };
  
//   const products = await productService.getAll(filter, options);
  
//   const userId = filter.userId;
//   if(userId){
//     const wishlist = await wishlistService.getAll(req.params.userId);
//     if(wishlist.results.length > 0){
//       const wishlistedProductIds = wishlist.results.map((item) => {
//         return item.productId._id.toString();
//       }); // Extract product IDs from wishlist
      
//       // Add `isWishlisted` flag to each product
//       products.results = products.results.map((product) => ({
//         ...product.toObject(), // Convert Mongoose object to plain JS object
//         isWishlisted: wishlistedProductIds.includes(product._id.toString()), // Check if product is in the wishlist

//         // isInStock: productService.getProductWithStockStatus(product._id),
//       }));

//     }
//   } 

//   // Build the aggregation pipeline
//   // const pipeline = [
//   //   {
//   //     $lookup: {
//   //       from: "wishlists", // The name of your Wishlist collection
//   //       localField: "_id", // Product `_id` field
//   //       foreignField: "productId", // Wishlist's `productId` field
//   //       as: "wishlistInfo", // Resulting field in the Product
//   //     },
//   //   },
//   //   {
//   //     $addFields: {
//   //       isWishlisted: {
//   //         $cond: {
//   //           if: {
//   //             $gt: [
//   //               {
//   //                 $size: {
//   //                   $filter: {
//   //                     input: "$wishlistInfo", // Check if the product exists in the wishlist
//   //                     as: "wishlist",
//   //                     cond: { $eq: ["$$wishlist.userId", userId] },
//   //                   },
//   //                 },
//   //               },
//   //               0,
//   //             ],
//   //           },
//   //           then: true,
//   //           else: false,
//   //         },
//   //       },
//   //     },
//   //   },
//   //   {
//   //     $project: {
//   //       wishlistInfo: 0, // Exclude the detailed wishlist info
//   //     },
//   //   },
//   //   {
//   //     $sort: { [sortBy || "createdAt"]: -1 }, // Sort by sortBy param or default to `createdAt`
//   //   },
//   //   {
//   //     $skip: (pageValue - 1) * limitValue, // Pagination: skip
//   //   },
//   //   {
//   //     $limit: limitValue, // Pagination: limit
//   //   },
//   // ];

//   // Execute the aggregation
//   // const products = await db.Product.aggregate(pipeline);

//   // console.log('controller product get all response', products );
//   res.sendResponse(products , 'Fetched Successfully', httpStatus.OK);
// });

const getById = catchAsync(async (req, res) => {
  const result = await productService.getById(req.params.productId);
  res.sendResponse(result, 'Fetched Successfully', httpStatus.OK);
});

const deleteById = catchAsync(async (req, res) => {
  const result = await productService.deleteById(req.params.productId);
  res.sendResponse(result, 'Deleted Successfully', httpStatus.OK);
});

const getLowStockProducts = catchAsync(async (req, res) => {
  const userId = req.params.userId; // Get userId from route params
  const threshold = parseInt(req.query.threshold) || 5; // Default threshold is 5

  // Fetch low stock products
  const products = await productService.getLowStockProducts(userId, threshold);
  
  res.sendResponse(products, "Low stock products fetched successfully", httpStatus.OK);
});

const getProductWithStockStatus = catchAsync(async (req, res) => {
  const productId = req.params.productId; // Default threshold is 5
  const products = await productService.getProductWithStockStatus(productId);
  res.sendResponse(products, "Product stock fetched successfully", httpStatus.OK);
});

module.exports = {
  create,
  getAll,
  getById,
  deleteById,
  update,
  getLowStockProducts,
  getProductWithStockStatus
};
