const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Offer name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Offer type is required'],
      enum: ['Seasonal Sale', 'Flash Deal', 'Loyalty Reward', 'Bundle Offer', 'Referral Bonus', 'General'],
      default: 'General',
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      required: [true, 'End date is required'],
    },
    linkedCoupons: [
      {
        type: String,
      }
    ],
    bannerColor: {
      type: String,
      default: '#3b82f6',
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Ended'],
      default: 'Active',
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-expire hook similar to Coupons
offerSchema.pre(/^find/, async function (next) {
  try {
    const today = new Date().toISOString().split('T')[0];
    await mongoose.model('Offer').updateMany(
      { endDate: { $lt: today }, status: { $ne: 'Ended' } },
      { $set: { status: 'Ended' } }
    );
  } catch (_) {
    // Non-blocking
  }
  next();
});

module.exports = mongoose.model('Offer', offerSchema);
