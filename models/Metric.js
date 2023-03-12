const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Metric extends Model {}


Metric.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    metric_label: {
        type: DataTypes.STRING,
        allowNull: false,
        values: [
            '$',
            'min',
            'Days',
            'Time(s)',
            '.',
            '%',
            'Yes/No',
        ],
    },
    metric_unit: {
        type:DataTypes.STRING,
        allowNull: false,
        values: [
            'Currency',
            'Time',
            'Date',
            'Integer',
            'Decimal',
            'Percentage',
            'Boolean',
        ],
    },
    goal_history_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'goal_history',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'metric',
  }
);

module.exports = Metric;
