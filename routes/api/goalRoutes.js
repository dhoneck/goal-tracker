const router = require('express').Router();

const Goal = require('../../models/Goal');

router.get('/', (req, res) => {
  Goal.findAll().then((goalData) => {
    res.json(goalData);
  })
})

router.post('/', (req, res) => {
  console.log('REQUEST BODY');
  console.log(req.body);
  Goal.create({
    goal: req.body.goal,
    description: req.body.description,
    category: req.body.category
  }).then((newGoal) => {
    // Send the newly created row as a JSON object
    res.json(newGoal);
  })
  .catch((err) => {
    res.json(err);
  });
});

module.exports = router;