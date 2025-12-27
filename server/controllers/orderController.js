const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user's order history (as buyer)
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ buyer: req.user.id })
            .populate('product', 'name images currentBid status')
            .populate('seller', 'name email phone avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get seller's sold items
// @route   GET /api/orders/sold-items
// @access  Private (Seller only)
exports.getSoldItems = async (req, res, next) => {
    try {
        const orders = await Order.find({ seller: req.user.id })
            .populate('product', 'name images currentBid status')
            .populate('buyer', 'name email phone address avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller or Admin)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['paid', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return next(new ErrorResponse('Invalid status', 400));
        }

        let order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorResponse('Order not found', 404));
        }

        // Only seller or admin can update status
        if (order.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to update this order', 403));
        }

        order.status = status;
        if (status === 'paid' && !order.paidAt) order.paidAt = Date.now();
        if (status === 'delivered' && !order.deliveredAt) order.deliveredAt = Date.now();

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get complete invoice data
// @route   GET /api/orders/invoice/:productId
// @access  Private
exports.getInvoiceData = async (req, res, next) => {
    try {
        const order = await Order.findOne({ product: req.params.productId })
            .populate('product', 'name currentBid status')
            .populate('buyer', 'name email phone address avatar')
            .populate('seller', 'name email phone address avatar');

        if (!order) {
            return next(new ErrorResponse('Invoice data not found', 404));
        }

        // Only buyer, seller or admin can view invoice
        if (order.buyer._id.toString() !== req.user.id && order.seller._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to view this invoice', 403));
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};
