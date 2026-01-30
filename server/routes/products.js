const express = require('express');
const multer = require('multer');
const { auth, sellerAuth, adminAuth } = require('../middleware/auth');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getMyProducts,
  getMyProducts,
  getWonProducts,
  hideWonProduct
} = require('../controllers/productController');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/me', auth, sellerAuth, getMyProducts);
router.get('/won', auth, getWonProducts);

router
  .route('/')
  .get(getProducts)
  .post(auth, sellerAuth, upload.array('images', 5), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(auth, sellerAuth, updateProduct)
  .delete(auth, sellerAuth, deleteProduct);

  .delete(auth, sellerAuth, deleteProduct);

router.put('/:id/hide', auth, hideWonProduct);

module.exports = router;
