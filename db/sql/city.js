'use strict'
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    timestamp: true,
    paranoid: true
  })

  return City
}
