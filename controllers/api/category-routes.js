const router = require('express').Router();
const { Category } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const category = await Category.create({
      user_id: req.session.user,
      category_name: req.body.categoryName
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  } 
});

module.exports = router;