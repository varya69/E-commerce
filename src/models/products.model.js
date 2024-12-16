const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ProductSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    vendor: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    reserved: {
      type: Number,
    },
    // cost: {
    //     type: Number,
    //     required: true,
    // },
    // basePrice: {
    //     type: Number,
    //     required: true,
    // },
    taxPercent: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // weight: {
    //     type: Number,
    // },
    thumbnail: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    productImages: [
      {
        name: String,
        link: String,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add a virtual field to check if the product is wishlisted
// ProductSchema.virtual('wishlisted').get(function () {
//   return this.wishlists && this.wishlists.length > 0;  // Assuming 'wishlists' contains the user reference
// });

// add plugin that converts mongoose to json
ProductSchema.plugin(toJSON);
ProductSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
