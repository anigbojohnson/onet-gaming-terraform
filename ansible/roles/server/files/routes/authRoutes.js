const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup
router.post('/signup', authController.signup);

// Login
router.post('/login', authController.login);

// current user
router.get('/current-user', authController.currentUser)

// logout user
router.post('/logout', authController.logoutUser)



module.exports = router;
