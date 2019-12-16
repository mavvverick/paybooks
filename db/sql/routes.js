'use strict'
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    routeId: DataTypes.INTEGER,
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
    Route.belongsTo(models.City, { foreignKey: 'origin_id' })
    Route.belongsTo(models.City, { foreignKey: 'dest_id' })
  }

  return Route
}
