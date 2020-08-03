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
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          min: 0.00
        }
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


