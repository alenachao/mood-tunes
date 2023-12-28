/* Main entry points for routes */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const searchRoutes = require('./search');

router.use('/auth', authRoutes);
router.use('/search', searchRoutes);

module.exports = router;