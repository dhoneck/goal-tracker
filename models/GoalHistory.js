const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GoalHistory extends Model {}

GoalHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    goal_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'goal',
        key: 'id',
      },    
    },
    log_frequency: {
      type: DataTypes.STRING,
      allowNull: false,
      values: [
        'Time(s)',
        'Per Hour',
        'Per Day',
        'Per Week',
        'Every Two Weeks',
        'Per Month',
        'Every Two Months',
        'Per Quarter',
        'Every Six Months',
        'Per Year',
      ],
    },
    reminder_time: {
      type: DataTypes.STRING,
      allowNull: false,
      values: [
        'Hourly',
        'Twice a day',
        'Daily',
        'Twice a week',
        'Weekly',
        'Monthly'
      ]
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    time_period: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'goal_history',
  }
);

module.exports = GoalHistory;
