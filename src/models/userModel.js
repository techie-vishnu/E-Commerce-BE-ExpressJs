const { default: mongoose } = require("mongoose");
const validRoles = ['Admin', 'Customer'];


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
        default: ['Customer'],
        enum: validRoles,
        validate: {
            validator: function (arr) {
                return arr.every(role => validRoles.includes(role));
            },
            message: props => `${props.value} contains invalid role`
        }
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

