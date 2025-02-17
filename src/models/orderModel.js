const { default: mongoose, Schema } = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [],
        required: true
    },
    total: {
        type: Number,
        default: 0
    },
    discountedTotal: {
        type: Number,
        default: 0
    },
    totalProducts: {
        type: Number,
        default: 0
    },
    totalQuantity: {
        type: Number,
        default: 0
    },
    deliveryAddress: {
        type: String,
        default: null
    },
    orderConfirmationStatus: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

