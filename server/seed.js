/**
 * COMS — Seed Script
 * Pushes all 15 mock coupons into MongoDB.
 *
 * Run:  node seed.js
 *       npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Coupon   = require('./models/Coupon');

// ─── Date Helpers ─────────────────────────────────────────────────────────────
const today      = new Date();
const fmt        = d => d.toISOString().split('T')[0];
const daysFromNow = n => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };
const daysAgo     = n => daysFromNow(-n);
const monthsAgo   = n => { const d = new Date(today); d.setMonth(d.getMonth() - n); return fmt(d); };

// ─── Seed Data (mirrors mockData.js exactly) ──────────────────────────────────
const seedCoupons = [
  {
    code: 'FLAT200', type: 'Flat', discountValue: 200, minOrder: 999,
    maxUses: 500, usageCount: 312, category: 'Electronics',
    startDate: monthsAgo(3), expiryDate: daysFromNow(45),
    description: 'Get ₹200 off on electronics orders above ₹999.', status: 'Active',
    createdAt: monthsAgo(3),
  },
  {
    code: 'SAVE30PCT', type: 'Percent', discountValue: 30, minOrder: 499,
    maxUses: 1000, usageCount: 876, category: 'Fashion',
    startDate: monthsAgo(5), expiryDate: daysFromNow(60),
    description: '30% off on all fashion products.', status: 'Active',
    createdAt: monthsAgo(5),
  },
  {
    code: 'BOGOFOOD', type: 'BOGO', discountValue: 0, minOrder: 299,
    maxUses: 200, usageCount: 198, category: 'Food',
    startDate: monthsAgo(2), expiryDate: daysFromNow(5),
    description: 'Buy one get one free on selected food items.', status: 'Active',
    createdAt: monthsAgo(2),
  },
  {
    code: 'FREESHIP99', type: 'Free Shipping', discountValue: 0, minOrder: 99,
    maxUses: 0, usageCount: 1240, category: 'All',
    startDate: monthsAgo(6), expiryDate: daysFromNow(90),
    description: 'Free shipping on all orders above ₹99.', status: 'Active',
    createdAt: monthsAgo(6),
  },
  {
    code: 'TRIPSAVE15', type: 'Percent', discountValue: 15, minOrder: 2000,
    maxUses: 300, usageCount: 87, category: 'Travel',
    startDate: monthsAgo(1), expiryDate: daysFromNow(3),
    description: '15% off on travel bookings above ₹2000.', status: 'Active',
    createdAt: monthsAgo(1),
  },
  {
    code: 'ELEC500', type: 'Flat', discountValue: 500, minOrder: 4999,
    maxUses: 150, usageCount: 49, category: 'Electronics',
    startDate: monthsAgo(4), expiryDate: daysFromNow(7),
    description: '₹500 off on electronics orders above ₹4999.', status: 'Active',
    createdAt: monthsAgo(4),
  },
  {
    code: 'FASHION50', type: 'Percent', discountValue: 50, minOrder: 1499,
    maxUses: 100, usageCount: 100, category: 'Fashion',
    startDate: monthsAgo(6), expiryDate: daysAgo(30),
    description: '50% off on premium fashion collections.', status: 'Expired',
    createdAt: monthsAgo(6),
  },
  {
    code: 'FOODBOGO2', type: 'BOGO', discountValue: 0, minOrder: 199,
    maxUses: 500, usageCount: 423, category: 'Food',
    startDate: monthsAgo(5), expiryDate: daysAgo(15),
    description: 'BOGO deal on weekend food orders.', status: 'Expired',
    createdAt: monthsAgo(5),
  },
  {
    code: 'SHIPFREE2', type: 'Free Shipping', discountValue: 0, minOrder: 0,
    maxUses: 5000, usageCount: 3211, category: 'All',
    startDate: monthsAgo(6), expiryDate: daysAgo(5),
    description: 'Free shipping site-wide — holiday promo.', status: 'Expired',
    createdAt: monthsAgo(6),
  },
  {
    code: 'PAUSE100', type: 'Flat', discountValue: 100, minOrder: 599,
    maxUses: 200, usageCount: 22, category: 'All',
    startDate: monthsAgo(1), expiryDate: daysFromNow(30),
    description: '₹100 off — temporarily paused for review.', status: 'Paused',
    createdAt: monthsAgo(1),
  },
  {
    code: 'LOYAL20', type: 'Percent', discountValue: 20, minOrder: 0,
    maxUses: 1000, usageCount: 543, category: 'All',
    startDate: monthsAgo(4), expiryDate: daysFromNow(120),
    description: '20% loyalty reward for returning customers.', status: 'Active',
    createdAt: monthsAgo(4),
  },
  {
    code: 'REFERBONUS', type: 'Flat', discountValue: 150, minOrder: 499,
    maxUses: 0, usageCount: 312, category: 'All',
    startDate: monthsAgo(2), expiryDate: daysFromNow(180),
    description: '₹150 off for every successful referral.', status: 'Active',
    createdAt: monthsAgo(2),
  },
  {
    code: 'TRAVEL20', type: 'Percent', discountValue: 20, minOrder: 5000,
    maxUses: 50, usageCount: 12, category: 'Travel',
    startDate: monthsAgo(1), expiryDate: daysFromNow(6),
    description: '20% off on international travel packages.', status: 'Active',
    createdAt: monthsAgo(1),
  },
  {
    code: 'FLASHSHIP', type: 'Free Shipping', discountValue: 0, minOrder: 0,
    maxUses: 500, usageCount: 489, category: 'All',
    startDate: monthsAgo(3), expiryDate: daysFromNow(30),
    description: 'Flash free shipping event.', status: 'Paused',
    createdAt: monthsAgo(3),
  },
  {
    code: 'NEWUSER50', type: 'Percent', discountValue: 50, minOrder: 299,
    maxUses: 0, usageCount: 2100, category: 'All',
    startDate: monthsAgo(6), expiryDate: daysFromNow(365),
    description: '50% off for new users on first order.', status: 'Active',
    createdAt: monthsAgo(6),
  },
];

// ─── Run Seed ─────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('\n🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to:', process.env.MONGO_URI);

    console.log('\n🗑  Clearing existing coupons...');
    const { deletedCount } = await Coupon.deleteMany({});
    console.log(`   Removed ${deletedCount} existing document(s).`);

    console.log('\n📥 Inserting seed coupons...');
    const inserted = await Coupon.insertMany(seedCoupons, { ordered: false });
    console.log(`   ✅ Inserted ${inserted.length} coupons.\n`);

    // Summary
    const totals = await Coupon.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    console.log('📊 Database Summary:');
    totals.forEach(t => console.log(`   ${t._id.padEnd(8)} → ${t.count} coupon(s)`));

    console.log('\n✨ Seed complete! Open MongoDB Compass and refresh coms_db → coupons.\n');
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
