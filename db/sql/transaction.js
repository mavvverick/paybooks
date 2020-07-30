'use strict'

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    tax: DataTypes.FLOAT,
    fee: DataTypes.FLOAT,
    meta: DataTypes.STRING,
    note: DataTypes.STRING,
    refund: DataTypes.STRING,
    app: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
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
      values: ['DEPOSIT', 'WITHDRAWAL', 'REFER', 'CASHBACK',
        'COMMISSION', 'NOTE', 'REFUND', 'BOOKING', 'GATEWAY']
    },
    status: {
      type: DataTypes.ENUM,
      values: [
        'INIT', 'PENDING', 'COMMITED',
        'DONE', 'CANCEL', 'FAILED', 'REVERT'
      ],
      defaultValue: 'INIT'
    }
  }, {
  // paranoid: true
  })
  Transaction.belongsTo(Transaction, { as: 'Parent', foreignKey: 'linkId' })
  return Transaction
}
