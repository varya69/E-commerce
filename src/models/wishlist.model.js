const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { Product } = require('./products.model');

// const WishlistSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     products: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true,
//         },
//         addedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

const WishlistSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// const WishlistSchema = mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     products: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// Method to add a product to the wishlist
// WishlistSchema.methods.addProduct = async function (productId) {
//   if (!this.products.includes(productId)) {
//     this.products.push(productId);
//     await this.save();

//     // Update the 'wishlisted' field of the product
//     await Product.findByIdAndUpdate(productId, { $set: { wishlisted: true } });
//   }
// };

// // Method to remove a product from the wishlist
// WishlistSchema.methods.removeProduct = async function (productId) {
//   const index = this.products.indexOf(productId);
//   if (index !== -1) {
//     this.products.splice(index, 1);
//     await this.save();

//     // Update the 'wishlisted' field of the product
//     await Product.findByIdAndUpdate(productId, { $set: { wishlisted: false } });
//   }
// };

// add plugin that converts mongoose to json
WishlistSchema.plugin(paginate);
WishlistSchema.plugin(toJSON);

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;
