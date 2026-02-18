const express = require('express');
const router = express.Router();
// Intha line-la ella functions-um irukkannu paarunga 👇
const { registerUser, loginUser, getAllUsers, deleteUser } = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Intha line thaan users list-ah kudukkum
router.get('/users', protect, authorize('Admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;