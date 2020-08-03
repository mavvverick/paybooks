'use strict'
var Code = require('./code');
module.exports = (sequelize, DataTypes) => {
  const Tax = sequelize.define('Tax', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sgst: {
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
      defaultValue: 0,
      allowNull: false
    }
  }, {
    paranoid: true
  })

  // Tax.associate = (models) => {
  //   Tax.belongsTo(models.Code);
  // }
  

  return Tax
}


