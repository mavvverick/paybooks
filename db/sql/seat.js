'use strict'
module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('Seat', {
    name: DataTypes.STRING,
    bId: DataTypes.INTEGER,
    rId: DataTypes.INTEGER,
    seat: DataTypes.STRING,
    day: DataTypes.INTEGER,
    fare: DataTypes.INTEGER,
    bookTime: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: [
        'INIT', 'PENDING', 'DONE',
        'CANCEL', 'FAILED'
      ],
      defaultValue: 'INIT'
    }
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['bId', 'seat', 'day']
      }
    ]
  })

  Seat.associate = function (models) {
    Seat.belongsTo(models.Booking, { foreignKey: 'bookId' })
  }

  return Seat
}
