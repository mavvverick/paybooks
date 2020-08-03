'use strict'
var Code = require('./code');
module.exports = (sequelize, DataTypes) => {
  const Access = sequelize.define('Access', {
    app: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },{
    paranoid: true
  })
  return Access
}


