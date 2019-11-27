'use strict'
module.exports = (sequelize, DataTypes) => {
  const CityPairs = sequelize.define('CityPairs', {
    originId: {
      type: DataTypes.STRING
      // unique: true
    },
    destinationId: {
      type: DataTypes.STRING
      // unique: true
    },
    travelIds: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamp: true,
    paranoid: true
  })

  return CityPairs
}
