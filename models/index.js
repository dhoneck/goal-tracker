const Category = require('./Category');
const Goal = require('./Goal');
const GoalHistory = require('./GoalHistory');
const GoalPeriod = require('./GoalPeriod');
const Metric = require('./Metric');
const Progress = require('./Progress');
const User = require('./User');

// Define Belong-To Relationships
Goal.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Goal.belongsTo(Category, {
    foreignKey: 'category_id',
    onUpdate: 'CASCADE',
});

GoalHistory.belongsTo(Goal, {
    foreignKey: 'goal_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

GoalPeriod.belongsTo(GoalHistory, {
    foreignKey: 'goal_history_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Progress.belongsTo(GoalPeriod, {
    foreignKey: 'goal_period_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Metric.belongsTo(GoalHistory, {
    foreignKey: 'metric_id'
});

//
// Define Has-Many Relationships
User.hasMany(Goal, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Category.hasMany(Goal, {
    foreignKey: 'category_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Goal.hasMany(GoalHistory, {
    foreignKey: 'goal_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

GoalHistory.hasMany(GoalPeriod, {
    foreignKey: 'goal_history_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

GoalPeriod.hasMany(Progress, {
    foreignKey: 'goal_period_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = { 
    User,
    Category,
    Goal,
    GoalHistory,
    GoalPeriod,
    Metric,
    Progress,
    User 
};