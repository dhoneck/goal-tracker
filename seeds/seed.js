const sequelize = require('../config/connection');
const { Category, Goal, GoalHistory, GoalPeriod, Metric, Progress, User } = require('../models');

const categoryData = require('./categoryData.json');
const goalData = require('./goalData.json');
// const goalHistoryData = require('./goalHistoryData.json');
// const goalPeriodData = require('./goalPeriodData.json');
// const metricData = require('./metricData.json');
// const progressData = require('./progressData.json');
const userData = require('./userData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const categories = await Category.bulkCreate(categoryData);
  const goals = await Goal.bulkCreate(goalData);

  process.exit(0);
};

seedDatabase();
