const mongoose = require('mongoose');
const { toJSON } = require('./plugins'); // Optional, for utility

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
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

WishlistSchema.plugin(toJSON);

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;
