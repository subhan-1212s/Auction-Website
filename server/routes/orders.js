const express = require('express');
const { auth } = require('../middleware/auth');
const { 
    getMyOrders, 
    getSoldItems, 
    updateOrderStatus,
    getInvoiceData
} = require('../controllers/orderController');

const router = express.Router();

router.get('/my-orders', auth, getMyOrders);
router.get('/sold-items', auth, getSoldItems);
router.get('/invoice/:productId', auth, getInvoiceData);
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
