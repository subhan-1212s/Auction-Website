const Product = require('../models/Product');
const Bid = require('../models/Bid');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
exports.placeBid = async (req, res, next) => {
  try {
    const { productId, amount } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (product.status !== 'active') {
      return next(new ErrorResponse('Auction is not active', 400));
    }

    if (new Date() > new Date(product.endTime)) {
      product.status = 'ended';
      await product.save();
      return next(new ErrorResponse('Auction has already ended', 400));
    }

    if (product.seller.toString() === req.user.id && req.user.role !== 'admin') {
       return next(new ErrorResponse('You cannot bid on your own product', 400));
    }

    const minBid = product.currentBid > 0 ? product.currentBid + product.minimumIncrement : product.startingPrice;
    if (amount < minBid) {
      return next(new ErrorResponse(`Minimum bid must be at least ₹${minBid}`, 400));
    }

    const bid = await Bid.create({
      product: productId,
      bidder: req.user.id,
      amount
    });

    product.currentBid = amount;
    product.bidCount += 1;
    product.winner = req.user.id;
    await product.save();

    // Notify previous highest bidder
    const prevBid = await Bid.findOne({ product: productId, bidder: { $ne: req.user.id } }).sort({ amount: -1 });
    if (prevBid) {
      const outbidNotif = await Notification.create({
        user: prevBid.bidder,
        type: 'outbid',
        message: `You have been outbid on "${product.name}". New highest bid: ₹${amount}`,
        product: productId
      });

      // Emit real-time notification to the outbid user
      if (req.io) {
        req.io.to(`user_${prevBid.bidder}`).emit('notification', outbidNotif);
      }
    }

    // Emit live update via Socket.io
    if (req.io) {
      req.io.to(`product_${productId}`).emit('bid_update', {
        productId,
        currentBid: amount,
        bidCount: product.bidCount,
        bidder: req.user.name
      });
    }

    res.status(201).json({ success: true, data: bid });
  } catch (err) {
    next(err);
  }
};

// @desc    Check and close ended auctions
exports.checkEndedAuctions = async (io) => {
  try {
    const now = new Date();
    const endedProducts = await Product.find({
      endTime: { $lte: now },
      status: 'active'
    }).populate('winner', 'name email');

    for (const product of endedProducts) {
      product.status = 'ended';
      await product.save();

      if (product.winner) {
        // Notify Winner (In-App)
        let winnerNotif = await Notification.findOne({ user: product.winner._id, type: 'auction_won', product: product._id });
        if (!winnerNotif) {
          winnerNotif = await Notification.create({
            user: product.winner._id,
            type: 'auction_won',
            message: `🏆 Congratulations! You won the auction for "${product.name}" with a winning bid of ₹${product.currentBid.toLocaleString('en-IN')}. Click to checkout!`,
            product: product._id
          });
        }

        // Notify Seller (In-App)
        let sellerNotif = await Notification.findOne({ user: product.seller, type: 'auction_ended', product: product._id });
        if (!sellerNotif) {
          sellerNotif = await Notification.create({
            user: product.seller,
            type: 'auction_ended',
            message: `🎉 Your auction for "${product.name}" has completed! Winning bid: ₹${product.currentBid.toLocaleString('en-IN')} by ${product.winner.name}`,
            product: product._id
          });
        }

        // Email Winner (Async background dispatch for instant zero delay)
        sendEmail({
          email: product.winner.email,
          subject: `🏆 YOU WON! Auction Winner for "${product.name}"`,
          message: `Congratulations ${product.winner.name}! You won the auction for "${product.name}". Your winning bid was ₹${product.currentBid.toLocaleString('en-IN')}. Please log in to complete your checkout and payment.`
        }).catch(err => console.error('Winner email dispatch error:', err.message));

        // Emit Instant Real-Time Socket Events
        if (io) {
          io.to(`product_${product._id}`).emit('auction_ended', {
            productId: product._id,
            winner: { _id: product.winner._id, name: product.winner.name }
          });

          io.to(`user_${product.winner._id}`).emit('notification', winnerNotif);
          io.to(`user_${product.winner._id}`).emit('cart_update');
          io.to(`user_${product.seller}`).emit('notification', sellerNotif);
        }
      } else {
        // No bids - notify seller
        const noBidNotif = await Notification.create({
          user: product.seller,
          type: 'auction_ended',
          message: `Your auction for "${product.name}" has ended with no bids.`,
          product: product._id
        });

        if (io) {
          io.to(`product_${product._id}`).emit('auction_ended', {
            productId: product._id,
            winner: null
          });
          io.to(`user_${product.seller}`).emit('notification', noBidNotif);
        }
      }
    }
  } catch (err) {
    console.error('Error checking ended auctions:', err);
  }
};
