const stripe = require('../config/stripe');
const PaytmChecksum = require('paytmchecksum');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// @desc    Create Stripe Payment Intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (product.winner.toString() !== req.user.id) {
      return next(new ErrorResponse('You are not the winner of this auction', 403));
    }

    if (product.status !== 'ended') {
      return next(new ErrorResponse('Auction has not ended successfully', 400));
    }

    const amount = product.currentBid * 100; // Stripe expects cents

    // --- DEMO MODE BYPASS ---
    if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' || !process.env.STRIPE_SECRET_KEY) {
      console.log('🧪 [DEMO MODE] Creating simulated Payment Intent');
      return res.status(200).json({
        success: true,
        clientSecret: `demo_secret_${Date.now()}_${productId}`,
        amount: product.currentBid,
        isDemo: true
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: { productId: product.id, buyerId: req.user.id }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: product.currentBid
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Confirm Payment & Create Order
// @route   POST /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, productId } = req.body;
    
    let isSuccess = false;

    // --- DEMO MODE / PAYTM / COD BYPASS ---
    if (paymentIntentId.startsWith('demo_') || paymentIntentId.startsWith('PAYTM_') || paymentIntentId.startsWith('cod_')) {
      console.log(`🧪 [DEMO/PAYTM/COD] Confirming payment: ${paymentIntentId}`);
      isSuccess = true;
    } else {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      isSuccess = paymentIntent.status === 'succeeded';
    }

    if (!isSuccess) {
      return next(new ErrorResponse('Payment not successful', 400));
    }

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorResponse('Product not found', 404));

    // Check if order already exists
    let order = await Order.findOne({ product: productId, status: 'paid' });
    if (order) {
       return res.status(200).json({ success: true, message: 'Order already processed', order });
    }

    // Determine payment method
    const isPaytm = paymentIntentId.toLowerCase().startsWith('paytm');
    const isCod = paymentIntentId.toLowerCase().startsWith('cod');
    
    // Create Payment Record
    const payment = await Payment.create({
      product: productId,
      buyer: req.user.id,
      seller: product.seller,
      amount: product.currentBid,
      method: isPaytm ? 'paytm' : isCod ? 'cod' : 'stripe',
      status: 'completed',
      transactionId: paymentIntentId,
      paidAt: new Date()
    });

    // Create Order with shipping address from req.body or fallback
    order = await Order.create({
      buyer: req.user.id,
      seller: product.seller,
      product: productId,
      amount: product.currentBid,
      payment: payment._id,
      status: 'paid',
      shippingAddress: req.body.address || {
        street: 'Default Address',
        city: 'City',
        state: 'State',
        zipCode: '000000',
        country: 'India'
      }
    });

    // Update product status
    product.status = 'sold';
    await product.save();

    // --- REAL-TIME UPDATES ---
    const Notification = require('../models/Notification');
    
    // 1. Notify Buyer
    const buyerNotif = await Notification.create({
      user: req.user.id,
      type: 'payment_success',
      message: `Payment successful for "${product.name}". Your order #${order._id.toString().slice(-6).toUpperCase()} is being processed.`,
      product: productId
    });

    // 2. Notify Seller
    const sellerNotif = await Notification.create({
      user: product.seller,
      type: 'item_sold',
      message: `Good news! "${product.name}" has been paid for by ${req.user.name}. Check your sales tab for details.`,
      product: productId
    });

    // 3. Emit via Sockets
    if (req.io) {
      req.io.to(`user_${req.user.id}`).emit('notification', buyerNotif);
      req.io.to(`user_${req.user.id}`).emit('cart_update'); // Trigger cart refresh
      req.io.to(`user_${product.seller}`).emit('notification', sellerNotif);
      req.io.to(`user_${product.seller}`).emit('sales_update'); // Trigger sales refresh for seller
    }

    // 4. Send Order Confirmation Email
    const sendEmail = require('../utils/sendEmail');
    const User = require('../models/User');
    
    try {
      const buyer = await User.findById(req.user.id);
      
      await sendEmail({
        email: buyer.email,
        subject: '🎉 Order Confirmation - Smart Auction',
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #1A1A1A 0%, #333 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">SMART AUCTION</h1>
              <p style="color: #fff; margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Elite Global Marketplace</p>
            </div>
            
            <div style="background: #fff; padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: #D4AF37; color: #fff; padding: 12px 24px; border-radius: 50px; font-weight: 900; font-size: 14px; letter-spacing: 1px;">
                  ✓ ORDER CONFIRMED
                </div>
              </div>
              
              <h2 style="color: #1A1A1A; margin: 0 0 20px; font-size: 24px; font-weight: 900;">Thank you for your purchase!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">Your payment has been successfully processed. We're preparing your order for shipment.</p>
              
              <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: #1A1A1A; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-weight: 700; text-align: right; font-size: 14px;">#${order._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Product:</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-weight: 700; text-align: right; font-size: 14px;">${product.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Amount Paid:</td>
                    <td style="padding: 8px 0; color: #D4AF37; font-weight: 900; text-align: right; font-size: 18px;">₹${product.currentBid.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment Method:</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-weight: 700; text-align: right; font-size: 14px;">${payment.method === 'paytm' ? 'Paytm' : payment.method === 'cod' ? 'Cash on Delivery' : 'Stripe'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Date:</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-weight: 700; text-align: right; font-size: 14px;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Delivery Address:</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-weight: 700; text-align: right; font-size: 14px; max-width: 200px; line-height: 1.4;">
                      ${order.shippingAddress.street}, ${order.shippingAddress.city},<br/>
                      ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${req.protocol}://${req.get('host')}/dashboard?tab=orders" style="display: inline-block; background: #1A1A1A; color: #D4AF37; padding: 16px 40px; text-decoration: none; border-radius: 4px; font-weight: 900; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 20px -10px rgba(0,0,0,0.3);">
                  Track Your Order
                </a>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">Step into the elite circle of owners.</p>
              </div>
              
              <p style="color: #999; font-size: 13px; text-align: center; margin: 30px 0 0; line-height: 1.6;">
                Questions? Contact us at <a href="mailto:support@smartauction.com" style="color: #D4AF37; text-decoration: none;">support@smartauction.com</a>
              </p>
            </div>
            
            <div style="background: #1A1A1A; padding: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.6;">
                © ${new Date().getFullYear()} Smart Auction. All rights reserved.<br/>
                Elite Global Marketplace for Premium Assets
              </p>
            </div>
          </div>
        `
      });
      
      console.log(`✅ Order confirmation email sent to ${buyer.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError);
      // Don't fail the entire request if email fails
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
// @desc    Initiate Paytm Transaction
// @route   POST /api/payments/paytm/initiate
// @access  Private
exports.initiatePaytmTransaction = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) return next(new ErrorResponse('Product not found', 404));

    const orderId = `PAYTM_${Date.now()}_${productId.slice(-6)}`;
    const amount = product.currentBid.toString();

    // --- MOCK MODE IF KEYS MISSING OR PLACEHOLDER ---
    if (!process.env.PAYTM_MID || process.env.PAYTM_MID === 'placeholder_mid' || process.env.PAYTM_MID.includes('placeholder')) {
      return res.status(200).json({
        success: true,
        isMock: true,
        orderId,
        amount,
        mid: "DEMO_MID"
      });
    }

    const paytmParams = {
      body: {
        requestType: "Payment",
        mid: process.env.PAYTM_MID,
        websiteName: process.env.PAYTM_WEBSITE || "DEFAULT", // Use env or default
        orderId: orderId,
        callbackUrl: `${req.protocol}://${req.get('host')}/api/payments/paytm/callback`,
        txnAmount: { value: amount, currency: "INR" },
        userInfo: { custId: req.user.id }
      }
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      process.env.PAYTM_MERCHANT_KEY
    );

    paytmParams.head = { signature: checksum };

    // Get txnToken from Paytm
    const isStaging = process.env.PAYTM_WEBSITE === 'WEBSTAGING';
    const host = isStaging ? 'securegw-stage.paytm.in' : 'securegw.paytm.in';
    const url = `https://${host}/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MID}&orderId=${orderId}`;

    const apiResponse = await axios.post(url, paytmParams);
    
    if (apiResponse.data.body.resultInfo.resultStatus === 'S') {
        const showPageUrl = `https://${host}/theia/api/v1/showPaymentPage?mid=${process.env.PAYTM_MID}&orderId=${orderId}`;
        res.status(200).json({
          success: true,
          txnToken: apiResponse.data.body.txnToken,
          orderId,
          amount,
          mid: process.env.PAYTM_MID,
          paytmUrl: showPageUrl
        });
    } else {
        console.error('Paytm Init Error:', apiResponse.data);
        return next(new ErrorResponse('Failed to initiate Paytm transaction', 500));
    }
  } catch (err) {
    next(err);
  }
};
// @desc    Verify Paytm Transaction (Callback)
// @route   POST /api/payments/paytm/callback
// @access  Public (Called by Paytm)
exports.verifyPaytmTransaction = async (req, res, next) => {
  try {
    const paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    const isVerifySignature = PaytmChecksum.verifySignature(
      req.body,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );

    if (isVerifySignature) {
      console.log("✅ Paytm Checksum Verified");
      
      if (req.body.STATUS === "TXN_SUCCESS") {
        // Logic to finalize order (similar to confirmPayment)
        // Note: Real implementation would need to match ORDERID back to Product
        // For now, redirect with success
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?orderId=${req.body.ORDERID}`);
      } else {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/failed?msg=${req.body.RESPMSG}`);
      }
    } else {
      console.log("❌ Paytm Checksum Verification Failed");
      res.status(400).send("Verification Failed");
    }
  } catch (err) {
    next(err);
  }
};
