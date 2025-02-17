const express = require('express');
const router = express.Router();
const { getProducts, getProductsById, addProduct, updateProduct, deleteProduct, bulkImportProducts, getProductsByCategory, getCategories } = require('../controllers/productController');

router.get('/', getProducts);
// router.get('/bulkImport', bulkImportProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/categories', getCategories);

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(200).json({
            success: false,
            error: ['Product id is not valid']
        })
    } else {
        next();
    }
}, getProductsById);



// Protected Routes (Admin CRUD Operations)
router.post('/', (req, res, next) => {
    const { title, description, quantity } = req.body;
    if (!title || !description || !quantity) {
        res.status(405).json({
            success: false,
            error: ['title, description & quantity are required to add product.']
        })
    } else {
        next();
    }
}, addProduct);

router.put('/', (req, res, next) => {
    const { title, description, quantity } = req.body;
    if (!title || !description || !quantity) {
        res.status(405).json({
            success: false,
            error: ['title, description & quantity are required to add product.']
        })
    } else {
        next();
    }
}, addProduct);

router.patch('/:id', (req, res, next) => {
    const { title, description, quantity } = req.body;
    let errors = [];
    if (typeof title !== 'undefined') {
        if (typeof title === 'string' && title.trim() === '') {
            errors.push("title is required");
        }
        if (typeof title !== 'string') {
            errors.push("title must be string");
        }
    }
    if (typeof description !== 'undefined') {
        if (typeof description === 'string' && description.trim() === '') {
            errors.push("description is required");
        }
        if (typeof description !== 'string') {
            errors.push("description must be string");
        }
    }
    if (typeof quantity !== 'undefined') {
        if (quantity == null) {
            errors.push("quantity is required");
        }
        if (typeof quantity !== 'number') {
            errors.push("quantity must be number");
        }
    }
    if (errors.length > 0) {
        res.status(405).json({
            success: false,
            error: errors,
        });
    } else {
        next();
    }
}, updateProduct);

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(405).json({
            success: false,
            error: ['Product id is not valid']
        })
    } else {
        next();
    }
}, deleteProduct);


module.exports = router;