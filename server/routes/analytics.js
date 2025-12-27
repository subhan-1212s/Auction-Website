const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { getUserStats, getPlatformStats } = require('../controllers/analyticsController');
const router = express.Router();

router.get('/user-stats', auth, getUserStats);
router.get('/stats', auth, adminAuth, getPlatformStats);

module.exports = router;
