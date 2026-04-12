const express = require('express');
const router  = express.Router();
const Offer  = require('../models/Offer');

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.type)   filter.type = req.query.type;

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const offers = await Offer.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (err) {
    console.error('[GET /api/offers]', err.message);
    res.status(500).json({ success: false, error: 'Server error. ' + err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, error: 'Offer not found.' });
    }
    res.json({ success: true, data: offer });
  } catch (err) {
    console.error('[GET /api/offers/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    console.log(`[POST] Offer created: ${offer.name}`);
    res.status(201).json({ success: true, data: offer });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(' | ') });
    }
    console.error('[POST /api/offer]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Offer not found.' });
    }
    console.log(`[PUT] Offer updated: ${updated.name}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(' | ') });
    }
    console.error('[PUT /api/offers/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Offer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Offer not found.' });
    }
    console.log(`[DELETE] Offer removed: ${deleted.name}`);
    res.json({ success: true, data: deleted });
  } catch (err) {
    console.error('[DELETE /api/offer/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
