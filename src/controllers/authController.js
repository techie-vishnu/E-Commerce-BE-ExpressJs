
const User = require('../models/userModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { name, username, email, mobile, password, confirmPassword } = req.body;
        const user = await User.findOne({ $or: [{ username: username.trim() }, { email: email.trim() }] });

        if (user) {
            let error = 'User exists';
            if (user.username === username.trim() && user.email === email.trim()) {
                error = 'Already registered user. Try login with username/email.';
            } else if (user.username === username.trim()) {
                error = 'Username already exists';
            } else if (user.email === email.trim()) {
                error = 'Email already registered. Try login with email.';
            }
            return res.status(405).json({
                success: false,
                error: error
            });
        } else {
            const hashedPwd = bcrypt.hashSync(password, 10);
            const user = new User({ name, username, email, mobile, password: hashedPwd });
            await user.save();

            // const token = jwt.sign({ data: { email: email } }, process.env.SECRET_KEY, { expiresIn: '1h' });
            // res.cookie('token', token);
        }

        res.status(200).json({
            success: true,
            message: "User created successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.usernameExists = async (req, res) => {
    const { username } = req.body;
    try {
        const user = User.findOne({ username: username.trim() });

        if (user) {
            return res.status(200).json({
                success: false,
                error: 'Username already exists.'
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'Username Ok'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.emailExists = async (req, res) => {
    const { email } = req.body;
    try {
        const user = User.findOne({ email: email.trim() });

        if (user) {
            return res.status(200).json({
                success: false,
                error: 'User registration exists with this email.'
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'Email Ok'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userExists = await User.findOne({
            $or: [{ username: username.trim() }, { email: username.trim() }]
        });

        if (!userExists) {
            return res.status(401).json({
                success: false,
                error: 'Username or password is wrong.'
            });
        }

        const passwordMatch = bcrypt.compareSync(password, userExists.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Username or password is wrong.'
            });
        }

        const token = jwt.sign({ data: userExists }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token);
        userExists.last_login = Date.now();
        await userExists.save();

        delete userExists.password;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            userId: userExists._id,
            data: userExists
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Authentication failed try Again'
        });
    }
}

exports.logout = (req, res) => {
    try {
        /* 
        You may want to perform additional
        cleanup or session invalidation here
        */
        res.clearCookie('token');
        
        return res.status(200).json({
            success: true,
            error: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.userProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const userData = await User.findOne({ email }).select(["-_id", "-password", "-__v"]);

        if (!userData) {
            return res.status(500).json({
                success: false,
                error: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            data: userData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

