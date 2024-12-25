const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true }, // Snapshot of product name
  price: { type: Number, required: true }, // Price at order time
  quantity: { type: Number, required: true },
  thumbnail: { type: String }, // Product image
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [OrderItemSchema], // List of items in the order
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash_On_Delivery", "Card_Payment", "UPI", "Net_Banking"],
      required: true,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile.addresses", // Refers to an address in the Profile model
      required: true,
    },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;

//   const ReviewSchema = mongoose.Schema({
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     rating: { type: Number, min: 1, max: 5 },
//     comment: { type: String },
//   });

// const NotificationSchema = mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     message: { type: String },
//     isRead: { type: Boolean, default: false },
//   });
  
  
// const Order = mongoose.model("Order", OrderSchema);
// const Payment = mongoose.model("Payment", PaymentSchema);

// module.exports = {Order, Payment};
