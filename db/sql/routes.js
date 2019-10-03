'use strict'
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
  }, {
    timestamp: true,
    paranoid: true
  })

  Route.associate = function (models) {
    Route.belongsTo(models.City, { foreignKey: 'whr' })
    Route.belongsTo(models.City, { foreignKey: 'frm' })
  }

  return Route
}
