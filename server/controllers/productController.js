const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all products with advanced filtering, search, and sorting
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let queryObj = JSON.parse(queryStr);
    
    // Add search functionality
    if (req.query.search) {
      queryObj.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by active status by default unless specified
    if (!queryObj.status) {
      queryObj.status = 'active';
    }

    query = Product.find(queryObj);

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(queryObj);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query.populate('seller', 'name avatar');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name avatar')
      .populate('winner', 'name avatar');

    if (!product) {
       return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res, next) => {
  try {
    // Check if user is approved to sell
    if (!req.user.isApproved && req.user.role !== 'admin') {
      return next(new ErrorResponse('Your seller account is pending approval. You cannot list products yet.', 403));
    }

    // Add user to req.body
    req.body.seller = req.user.id;

    // Handle images if uploaded via multer
    if (req.files) {
      req.body.images = req.files.map(file => {
        // Just store the filename or relative path from uploads
        return `/uploads/${file.filename}`;
      });
    }

    // Map frontend naming to backend model
    if (req.body.startingBid) {
      req.body.startingPrice = req.body.startingBid;
    }
    if (req.body.expiryDate) {
      req.body.endTime = req.body.expiryDate;
    }

    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's products
// @route   GET /api/products/me
// @access  Private/Seller
exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products won by the user
// @route   GET /api/products/won
// @access  Private
exports.getWonProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      winner: req.user.id,
      status: { $in: ['ended', 'sold'] }
    }).sort({ endTime: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this product`, 401));
    }

    await product.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
