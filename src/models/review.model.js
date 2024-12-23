const ReviewSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      review: { type: String, required: false },
    },
    { timestamps: true }
  );
  
  const Review = mongoose.model('Review', ReviewSchema);
  