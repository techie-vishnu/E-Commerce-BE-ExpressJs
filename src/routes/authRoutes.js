const express = require('express');
const router = express.Router();
const { registerUser, login, logout, userProfile } = require('../controllers/authController');
const { authUser } = require('../middlewares/authUser');


router.post('/auth/register', registerUser);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/user/profile', authUser, userProfile);


module.exports = router;