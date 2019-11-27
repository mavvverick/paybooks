'use strict'
module.exports = (sequelize, DataTypes) => {
  const Schedules = sequelize.define('Schedules', {
    date: {
      type: DataTypes.DATE
      // unique: true
    },
    originId: {
      type: DataTypes.STRING
      // unique: true
    },
    destinationId: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamp: true,
    paranoid: true
  })

  return Schedules
}
