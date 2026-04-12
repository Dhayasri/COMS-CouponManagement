const express = require('express');
const router  = express.Router();
const Coupon  = require('../models/Coupon');

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.type)     filter.type     = req.query.type;
    if (req.query.category) filter.category = req.query.category;

    // Free-text search on code or description
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ code: regex }, { description: regex }];
    }

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (err) {
    console.error('[GET /api/coupons]', err.message);
    res.status(500).json({ success: false, error: 'Server error. ' + err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/coupons/:id
// Returns a single coupon by MongoDB _id
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Coupon not found.' });
    }
    res.json({ success: true, data: coupon });
  } catch (err) {
    console.error('[GET /api/coupons/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/coupon  (also mounted at /api/coupons via the router)
// Creates a new coupon
// Body (JSON): { code, type, discountValue, minOrder, maxUses, category,
//               startDate, expiryDate, description, status }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    console.log(`[POST] Coupon created: ${coupon.code}`);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    // Duplicate coupon code (unique index violation)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `Coupon code "${req.body.code}" already exists.`,
      });
    }
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(' | ') });
    }
    console.error('[POST /api/coupon]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/coupons/:id
// Updates an existing coupon (all fields optional)
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Coupon not found.' });
    }
    console.log(`[PUT] Coupon updated: ${updated.code}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(' | ') });
    }
    console.error('[PUT /api/coupons/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/coupon/:id
// Permanently deletes a coupon by MongoDB _id
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Coupon not found.' });
    }
    console.log(`[DELETE] Coupon removed: ${deleted.code}`);
    res.json({ success: true, data: deleted });
  } catch (err) {
    console.error('[DELETE /api/coupon/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
