const NotificationSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      type: { type: String, enum: ['Order', 'Stock', 'General'], required: true },
      isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  
  const Notification = mongoose.model('Notification', NotificationSchema);
  