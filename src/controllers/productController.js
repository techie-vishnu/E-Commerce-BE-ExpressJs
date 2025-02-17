const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const bulk = require('./products.json');

let products = [];

exports.getProducts = async (req, res) => {
    try {
        const { q, sortBy, order, limit } = req.query;
        let products = [];
        if (q && q.trim() !== '') {
            const pattern = q.trim();
            products = await Product.find({
                enabled: true,
                $or: [
                    { title: { $regex: pattern, $options: 'i' } },
                    { description: { $regex: pattern, $options: 'i' } }
                ]
            });
        } else {
            products = await Product.find({ enabled: true }).limit(100);
        }

        return res.status(200).json({
            success: true,
            products: products,
            total: products.length
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server error."
        });
    }
}


exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        let products = await Product.find({ enabled: true, category: category.trim() });

        return res.status(200).json({
            success: true,
            products: products,
            total: products.length
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message || "Internal Server error."
        });
    }
}

exports.getProductsById = (req, res) => {
    try {
        const { id } = req.params;
        let p = Product.findById(id);
        if (p.length > 0) {
            return res.status(200).json({
                success: true,
                data: p
            })
        }
        else {
            return res.status(404).json({
                success: false,
                error: "Product not found."
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server error."
        });
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { title, description, category, price, stock, images, thumbnail } = req.body;
        if (title && description && category && price && stock && images && thumbnail) {
            const products = new Product({
                title: title,
                description: description,
                category: category,
                price: parseFloat(price),
                stock: parseInt(stock),
                images: Array.isArray(images) && images.length > 0 ? images : [thumbnail],
                thumbnail: thumbnail
            });

            await products.save();

            res.status(200).json({
                success: true,
                message: "Product added successfully",
                data: products
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server error."
        });
    }
}

exports.bulkImportProducts = async (req, res) => {
    try {
        console.log(bulk);
        bulk.map(async (prod, i) => {

            let exists = await Product.findOne({ title: prod.title, category: prod.category });
            if (!exists) {
                let p = new Product({
                    title: prod.title,
                    description: prod.description,
                    category: prod.category,
                    price: prod.price,
                    stock: prod.stock,
                    minimumOrderQuantity: prod.minimumOrderQuantity,
                    images: prod.images,
                    thumbnail: prod.thumbnail
                });

                p.save();
            }
        });
        return res.status(200).json({
            success: true,
            products: bulk
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server error."
        });
    }
}


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, price, stock, images, thumbnail } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            });
        }

        if (title && title === 'string')
            product.title = title.trim();
        if (description && typeof description === 'string')
            product.description = description.trim();
        if (quantity && typeof quantity === 'number')
            product.quantity = parseInt(quantity);
        if (category && typeof category === 'string') {
            const catExists = await Category.findOne({ slug: category });
            if (catExists) {
                product.category = category;
            }
        }
        if (price && typeof price === 'number')
            product.price = parseFloat(price);
        if (stock && typeof stock === 'number')
            product.stock = parseInt(stock);
        if (images && Array.isArray(images) && images.length > 0)
            product.images = images;
        if (thumbnail && typeof thumbnail === 'string')
            product.thumbnail = thumbnail;

        await product.save();
        
        res.status(200).json({
            success: true,
            message: "Product updated",
            data: product
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server error."
        });
    }
}

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    products = products.filter((p, i) => p.id !== parseInt(id));
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: products
    })
}

exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

}