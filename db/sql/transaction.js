'use strict'

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.STRING,
    to: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 0
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0
    },
    orderId: DataTypes.STRING,
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    refundAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    sgst:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    cgst: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    igst: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    fee: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    meta: DataTypes.STRING,
    note: DataTypes.STRING,
    extra: DataTypes.STRING,
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
    code: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: [
        'INIT', 'PENDING', 'COMMITED',
        'DONE', 'CANCEL', 'FAILED', 'REVERT'
      ],
      defaultValue: 'INIT'
    }
  })

  Transaction.afterCreate((transaction, options) => {
    if(transaction.provider === 'SELF'){
      let data = [{
          tId: transaction.id,
          wId: parseInt(transaction.from),
          amount: transaction.amount,
          type: "DR",
          meta: transaction.meta
      },{
        tId: transaction.id,
        wId: parseInt(transaction.to),
        type: "CR",
        amount: transaction.amount,
        meta: transaction.meta
      }]

      return new Promise((resolve, reject) => {
       return  transaction.sequelize.models.Book.bulkCreate(data,{
          transaction: options.transaction
        }).then((foundedInstace, err)=>{
            resolve("done");
        }).catch(err => {
          reject('Can not add entry in Books');
        });
      });

    }
  });

  Transaction.afterUpdate(async(transaction, options) => {
    if(transaction.provider === 'PAYTM' || transaction.provider === 'RZP'){
      console.log("SAVED ", transaction.provider)
      let data = [{
        tId: transaction.id,
        wId: parseInt(transaction.from),
        amount: transaction.amount,
        type: "DR",
        meta: transaction.meta
      },{
        tId: transaction.id,
        wId: parseInt(transaction.to),
        type: "CR",
        amount: transaction.amount,
        meta: transaction.meta
      }]

      return new Promise((resolve, reject) => {
        return  transaction.sequelize.models.Book.bulkCreate(data,{
            transaction: options.transaction
          }).then((foundedInstace, err)=>{
              resolve("done");
          }).catch(err => {
            reject('Can not add entry in Books');
          });
      }); 
    }
  });
  

  Transaction.belongsTo(Transaction, { as: 'Parent', foreignKey: 'linkId' })
  Transaction.associate = (models) => {
    Transaction.hasMany(models.Book,{ 
      foreignKey: 'tId'
    });
  }

  return Transaction
}
