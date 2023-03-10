const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Progress extends Model {}


Progress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    goal_period_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'goal_period',
        key: 'id',
      },    
    },
    update_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    progress_amount: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'progress',
  }
);

module.exports = Progress;
