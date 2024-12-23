const PaymentSchema = new mongoose.Schema(
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
      paymentMethod: { type: String, enum: ['Card', 'NetBanking', 'UPI', 'CashOnDelivery'], required: true },
      paymentStatus: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Pending' },
      transactionId: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  const Payment = mongoose.model('Payment', PaymentSchema);
  