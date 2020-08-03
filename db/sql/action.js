'use strict'
var Code = require('./code');
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pk: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    table: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    isCreate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastVersion: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },{
    paranoid: true
  })

  return Action
}


