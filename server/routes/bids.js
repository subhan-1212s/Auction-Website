const express = require('express');
const { auth } = require('../middleware/auth');
const { placeBid, checkEndedAuctions } = require('../controllers/auctionController');
const Bid = require('../models/Bid');

const router = express.Router();

// Place a bid
router.post('/', auth, placeBid);

// Get bids for a product
router.get('/product/:productId', async (req, res, next) => {
  try {
    const bids = await Bid.find({ product: req.params.productId })
      .populate('bidder', 'name avatar')
      .sort({ amount: -1 });
    res.json({ success: true, data: bids });
  } catch (err) {
    next(err);
  }
});

// Get user's bids
router.get('/my-bids', auth, async (req, res, next) => {
  try {
    const bids = await Bid.find({ bidder: req.user.id })
      .populate('product', 'name status currentBid endTime images')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bids });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
module.exports.checkEndedAuctions = checkEndedAuctions;
