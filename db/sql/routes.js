'use strict'
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    origin_id: DataTypes.INTEGER,
    dest_id: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    isPopular: DataTypes.BOOLEAN
  }, {
    timestamp: true,
    paranoid: true
  })

  Route.associate = function (models) {
    Route.belongsTo(models.City, { as: 'origin', foreignKey: 'origin_id' })
    Route.belongsTo(models.City, { as: 'dest', foreignKey: 'dest_id' })
  }

  return Route
}
