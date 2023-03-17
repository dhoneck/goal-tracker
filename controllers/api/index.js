const router = require('express').Router();

const userRoutes = require('./user-routes');
const goalRoutes = require('./goal-routes');
const categoryRoutes = require('./category-routes');

router.use('/users', userRoutes);
router.use('/goals', goalRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;