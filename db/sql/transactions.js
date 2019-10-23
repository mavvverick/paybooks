
'use strict'

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    fee: DataTypes.FLOAT,
    text: DataTypes.STRING,
    meta: DataTypes.STRING,
    ip: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
    },
    type: {
      type: DataTypes.ENUM,
      values: ['DR', 'CR']
    },
    category: {
      type: DataTypes.ENUM,
      values: ['DEPOSIT', 'WITHDRAWL', 'REFER', 'CASHBACK']
    },
    status: {
      type: DataTypes.ENUM,
      values: [
        'INIT', 'PENDING', 'COMMITED',
        'DONE', 'CANCEL', 'FAILED'
      ],
      defaultValue: 'INIT'
    }
  }, {
  // paranoid: true
  })

  return Transaction
}
