const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authenticateToken, authorizeManager } = require('../middleware/auth');

const router = express.Router();

// Get all products with filters
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category_id').optional().isInt().withMessage('Category ID must be an integer'),
  query('supplier_id').optional().isInt().withMessage('Supplier ID must be an integer'),
  query('status').optional().isIn(['in_stock', 'low_stock', 'out_of_stock', 'expired', 'damaged', 'returns', 'owner_bearing']).withMessage('Invalid status'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 50,
      category_id,
      supplier_id,
      status,
      search
    } = req.query;

    const offset = (page - 1) * limit;

    const filters = {
      category_id,
      supplier_id,
      status,
      search,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const products = await Product.findAll(filters);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length // In a real app, you'd get total count separately
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get product by ID
router.get('/:id', authenticateToken, [
  param('id').isInt().withMessage('Product ID must be an integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Get product by barcode
router.get('/barcode/:barcode', authenticateToken, [
  param('barcode').notEmpty().withMessage('Barcode is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { barcode } = req.params;
    const product = await Product.findByBarcode(barcode);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product by barcode error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Create new product
router.post('/', authenticateToken, authorizeManager, [
  body('name').notEmpty().withMessage('Product name is required'),
  body('buy_price').isFloat({ min: 0 }).withMessage('Buy price must be a positive number'),
  body('sell_price').isFloat({ min: 0 }).withMessage('Sell price must be a positive number'),
  body('current_stock').isFloat({ min: 0 }).withMessage('Current stock must be a non-negative number'),
  body('min_stock').isFloat({ min: 0 }).withMessage('Minimum stock must be a non-negative number'),
  body('unit').isIn(['pieces', 'kg', 'g', 'liter', 'ml', 'bottles', 'pack']).withMessage('Invalid unit'),
  body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
  body('supplier_id').optional().isInt().withMessage('Supplier ID must be an integer'),
  body('barcode').optional().isString().withMessage('Barcode must be a string'),
  body('expiry_date').optional().isISO8601().withMessage('Expiry date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = req.body;
    const productId = await Product.create(productData);

    const newProduct = await Product.findById(productId);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Product with this barcode already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// Update product
router.put('/:id', authenticateToken, authorizeManager, [
  param('id').isInt().withMessage('Product ID must be an integer'),
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('buy_price').optional().isFloat({ min: 0 }).withMessage('Buy price must be a positive number'),
  body('sell_price').optional().isFloat({ min: 0 }).withMessage('Sell price must be a positive number'),
  body('current_stock').optional().isFloat({ min: 0 }).withMessage('Current stock must be a non-negative number'),
  body('min_stock').optional().isFloat({ min: 0 }).withMessage('Minimum stock must be a non-negative number'),
  body('unit').optional().isIn(['pieces', 'kg', 'g', 'liter', 'ml', 'bottles', 'pack']).withMessage('Invalid unit'),
  body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
  body('supplier_id').optional().isInt().withMessage('Supplier ID must be an integer'),
  body('barcode').optional().isString().withMessage('Barcode must be a string'),
  body('expiry_date').optional().isISO8601().withMessage('Expiry date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updated = await Product.update(id, updateData);
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update product'
      });
    }

    const updatedProduct = await Product.findById(id);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Product with this barcode already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// Update product stock
router.patch('/:id/stock', authenticateToken, authorizeManager, [
  param('id').isInt().withMessage('Product ID must be an integer'),
  body('new_stock').isFloat({ min: 0 }).withMessage('New stock must be a non-negative number'),
  body('adjustment_type').optional().isIn(['purchase', 'sale', 'damage', 'return', 'correction', 'expired', 'other']).withMessage('Invalid adjustment type'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { new_stock, adjustment_type = 'manual', reason = '' } = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updated = await Product.updateStock(id, new_stock, adjustment_type, reason, req.user.id);
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update stock'
      });
    }

    const updatedProduct = await Product.findById(id);

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
});

// Delete product
router.delete('/:id', authenticateToken, authorizeManager, [
  param('id').isInt().withMessage('Product ID must be an integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const deleted = await Product.delete(id);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// Get low stock products
router.get('/inventory/low-stock', authenticateToken, async (req, res) => {
  try {
    const products = await Product.getLowStockProducts();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products'
    });
  }
});

// Get out of stock products
router.get('/inventory/out-of-stock', authenticateToken, async (req, res) => {
  try {
    const products = await Product.getOutOfStockProducts();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get out of stock products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch out of stock products'
    });
  }
});

// Get expired products
router.get('/inventory/expired', authenticateToken, async (req, res) => {
  try {
    const products = await Product.getExpiredProducts();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get expired products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expired products'
    });
  }
});

// Get inventory summary
router.get('/inventory/summary', authenticateToken, async (req, res) => {
  try {
    const summary = await Product.getInventorySummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get inventory summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory summary'
    });
  }
});

module.exports = router;