const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Goal extends Model {}

Goal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    goal: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'Goal'
  }
);

module.exports = Goal;