const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Goal extends Model {
  isTemplate() {
    return this.user_id == null;
  }
}

Goal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    goal_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id',
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newGoalData) => {
        // Capitalize first letter of goal name
        newGoalData.goal_name = newGoalData.goal_name[0].toUpperCase() + newGoalData.goal_name.substr(1);
        return newGoalData;
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'goal',
  }
);

module.exports = Goal;
