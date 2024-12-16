const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// const CartSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     items: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           default: 1,
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

const CartSchema = mongoose.Schema(
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    }
  },
  {
    timestamps: true,
  }
);

// const CartSchema = mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.SchemaTypes.ObjectId,
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
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

CartSchema.plugin(paginate);
CartSchema.plugin(toJSON);

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
