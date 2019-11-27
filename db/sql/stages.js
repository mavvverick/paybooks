'use strict'
module.exports = (sequelize, DataTypes) => {
  const Stage = sequelize.define('Stage', {
    name: {
      type: DataTypes.STRING
      // unique: true
    },
    cityId: {
      type: DataTypes.STRING
      // unique: true
    },
    cityName: {
      type: DataTypes.INTEGER
    },
    lat: {
      type: DataTypes.FLOAT
    },
    lon: {
      type: DataTypes.FLOAT
    },
    areaName: {
      type: DataTypes.STRING
    }
  }, {
    timestamp: true,
    paranoid: true
  })

  return Stage
}
