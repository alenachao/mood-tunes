/* Main entry points for routes */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const searchRoutes = require('./search');
const tracksRoutes = require('./tracks');

router.use('/auth', authRoutes);
router.use('/search', searchRoutes);
router.use('/tracks', tracksRoutes);

module.exports = router;