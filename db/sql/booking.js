'use strict'
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    userId: DataTypes.STRING(32),
    orderId: DataTypes.STRING(24),
    paymentId: DataTypes.STRING(24),
    seats: DataTypes.STRING(32),
    name: DataTypes.STRING(50),
    mob: DataTypes.STRING(12),
    bId: DataTypes.INTEGER,
    rId: DataTypes.INTEGER,
    fare: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    disc: DataTypes.INTEGER,
    // frm: DataTypes.STRING,
    // whr: DataTypes.STRING,
    // bPoint: DataTypes.STRING,
    // dPoint: DataTypes.STRING,
    // bTime: DataTypes.INTEGER,
    // dTime: DataTypes.INTEGER,
    // maxCanTime: DataTypes.INTEGER,
    // agentId: DataTypes.STRING,
    // comm: DataTypes.STRING,
    day: DataTypes.INTEGER,
    bus: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM,
      values: [
        'INIT', 'PENDING', 'DONE',
        'CANCEL', 'FAILED'
      ],
      defaultValue: 'INIT'
    },
    extra: DataTypes.STRING,
    meta: DataTypes.STRING,
    gst: DataTypes.STRING
  }, {
    timestamp: true,
    paranoid: true
  })

  Booking.associate = function (models) {
    Booking.hasMany(models.Seat, { foreignKey: 'bookId', as: 'seats' })
  }

  Booking.associate = function (models) {
    Booking.hasMany(models.Refund, { foreignKey: 'bookId', as: 'refunds' })
  }

  return Booking
}
