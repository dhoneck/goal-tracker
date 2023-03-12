const router = require('express').Router();

const userRoutes = require('./user-routes');
const goalRoutes = require('./goal-routes');

router.use('/users', userRoutes);
router.use('/goals', goalRoutes);

module.exports = router;