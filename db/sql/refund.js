'use strict'
module.exports = (sequelize, DataTypes) => {
  const Refund = sequelize.define('Refund', {
    refundId: DataTypes.STRING(22),
    userId: DataTypes.STRING(32),
    text: DataTypes.STRING,
    meta: DataTypes.STRING
  }, {
    timestamp: true,
    paranoid: true
  })

  Refund.associate = function (models) {
    Refund.belongsTo(models.Booking, { foreignKey: 'bookId' })
  }

  return Refund
}
