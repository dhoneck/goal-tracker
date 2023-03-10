const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GoalPeriod extends Model {}


GoalPeriod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    goal_history_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'goal_history',
        key: 'id',
      },    
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    goal_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    current_amount: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    goal_complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
  },
  {
    hooks: {
        beforeUpdate: async (newGoalData) => {
            // check for goal amount completion from Progress data
            if (newGoalData.current_amount > newGoalData.goal_amount) {
                newGoalData.goal_complete = true;
                return newGoalData;
            }
        },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'goal_period',
  }
);

module.exports = GoalPeriod;
