const mongoose = require('mongoose');

// ─── Coupon Schema ────────────────────────────────────────────────────────────
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [4, 'Code must be at least 4 characters'],
    },
    type: {
      type: String,
      required: [true, 'Discount type is required'],
      enum: {
        values: ['Flat', 'Percent', 'BOGO', 'Free Shipping'],
        message: 'Type must be Flat, Percent, BOGO, or Free Shipping',
      },
    },
    discountValue: {
      type: Number,
      default: 0,
      min: [0, 'Discount value cannot be negative'],
    },
    minOrder: {
      type: Number,
      default: 0,
      min: [0, 'Min order cannot be negative'],
    },
    maxUses: {
      type: Number,
      default: 0,     // 0 = unlimited
      min: [0, 'Max uses cannot be negative'],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      default: 'All',
      enum: ['All', 'Electronics', 'Fashion', 'Food', 'Travel'],
    },
    startDate: {
      type: String,   // YYYY-MM-DD string for easy comparison
      required: [true, 'Start date is required'],
    },
    expiryDate: {
      type: String,   // YYYY-MM-DD
      required: [true, 'Expiry date is required'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Expired'],
      default: 'Active',
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    versionKey: false,   // removes __v
    toJSON:  { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Auto-expire middleware ────────────────────────────────────────────────────
// Runs before every find query → marks stale coupons as Expired in DB automatically
couponSchema.pre(/^find/, async function (next) {
  try {
    const today = new Date().toISOString().split('T')[0];
    await mongoose.model('Coupon').updateMany(
      { expiryDate: { $lt: today }, status: { $ne: 'Expired' } },
      { $set: { status: 'Expired' } }
    );
  } catch (_) {
    // Non-blocking: just skip if it fails
  }
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
