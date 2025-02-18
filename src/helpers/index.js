const Category = require("../models/categoryModel");

exports.validateInsertProduct = async (req, res, next) => {
    const { title, description, category, price, stock, images, thumbnail } = req.body;
    if (!title || !description || !category || !price || !stock || !images || !thumbnail) {
        return res.status(405).json({
            success: false,
            error: "title, description, category, price, stock, images & thumbnail are Required for adding a Product.",
        });
    }
    let errors = [];
    if (typeof title === 'string' && title.trim() === '') {
        errors.push("title is required");
    }
    else if (typeof title !== 'string') {
        errors.push("title must be string");
    }
    else if (typeof description === 'string' && description.trim() === '') {
        errors.push("description is required");
    }
    else if (typeof description !== 'string') {
        errors.push("description must be string");
    }
    else if (typeof category === 'string' && category.trim() === '') {
        errors.push("category is required");
    }
    else if (typeof category !== 'string') {
        errors.push("category must be string");
    }
    else if (price == null) {
        errors.push("price is required");
    }
    else if (typeof price !== 'number') {
        errors.push("price must be number");
    }
    else if (stock == null) {
        errors.push("stock is required");
    }
    else if (typeof stock !== 'number') {
        errors.push("stock must be number");
    }
    else {
        const categoryExists = await Category.find({ slug: category });
        if (!categoryExists) {
            errors.push("category is not valid");
        }
    }

    if (errors.length > 0) {
        return res.status(405).json({
            success: false,
            error: errors[0],
        });
    }

    next();
}

exports.validateUpdateProduct = async (req, res, next) => {
    const { title, description, category, price, stock, images, thumbnail } = req.body;
    let errors = [];
    if (typeof title !== 'undefined') {
        if (typeof title === 'string' && title.trim() === '') {
            errors.push("title is required");
        }
        else if (typeof title !== 'string') {
            errors.push("title must be string");
        }
    }
    if (typeof description !== 'undefined') {
        if (typeof description === 'string' && description.trim() === '') {
            errors.push("description is required");
        }
        else if (typeof description !== 'string') {
            errors.push("description must be string");
        }
    }
    if (typeof category !== 'undefined') {
        if (typeof category === 'string' && category.trim() === '') {
            errors.push("category is required");
        }
        else if (typeof category !== 'string') {
            errors.push("category must be string");
        } else {
            const categoryExists = await Category.find({ slug: category });
            if (!categoryExists) {
                errors.push("category is not valid");
            }
        }
    }
    if (typeof price !== 'undefined') {
        if (price == null) {
            errors.push("price is required");
        }
        else if (typeof price !== 'number') {
            errors.push("price must be number");
        }
    }
    if (typeof stock !== 'undefined') {
        if (stock == null) {
            errors.push("stock is required");
        }
        else if (typeof stock !== 'number') {
            errors.push("stock must be number");
        }
    }
    if (errors.length > 0) {
        return res.status(405).json({
            success: false,
            error: errors,
        });
    } else {
        next();
    }
}
