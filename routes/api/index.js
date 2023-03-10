const router = require('express').Router();
const goalRoutes = require('./goalRoutes');

// Prefix all routes defined in `goalRoutes.js` with `/goals
router.use('/goals', goalRoutes);

module.exports = router;
