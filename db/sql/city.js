'use strict'
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    name: {
      type: DataTypes.STRING
      // unique: true
    },
    codes: {
      type: DataTypes.STRING
      // unique: true
    },
    oc: {
      type: DataTypes.INTEGER
    },
    dc: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamp: true,
    paranoid: true
  })

  return City
}
