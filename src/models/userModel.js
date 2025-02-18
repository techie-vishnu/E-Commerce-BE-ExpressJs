const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        RegExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    mobile: {
        type: Number,
        required: true
    },
    roles: {
        type: [String],
        default: ['customer']
    },
    enabled: {
        type: Boolean,
        default: true
    },
    last_login: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;

