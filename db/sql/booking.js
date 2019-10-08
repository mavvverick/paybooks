'use strict'
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    userId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    name: DataTypes.STRING,
    mob: DataTypes.STRING,
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
    // day: DataTypes.INTEGER,
    // maxCanTime: DataTypes.INTEGER,
    // agentId: DataTypes.STRING,
    // comm: DataTypes.STRING,
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
