const CError = require('../../errors/cError')
const Schema = require('./schema')
const { Op } = require('sequelize')

function debitTransfer (data, columnKey) {
  const self = this
  let updateData = null

  return self.Sequelize.transaction(function (t) {
    if (data.type !== 'DR') {
      throw new CError(
        {
          message: 'Inappropriate transaction type',
          code: 703,
          status: 406,
          name: 'Internal Wallet'
        }
      )
    }
    const transactionData = Schema.validateTransaction(data)
    return self.TransactionModel
    .create(transactionData, {
      transaction: t
    }).then(transactionRecord => {
      return self.WalletModel.update(
        {
          amount: self.Sequelize.literal(`amount + ${parseFloat(-transactionData.amount)}`)
        },
        { where: {
          userId: data.userId,
          amount: {
            [Op.gte]: transactionData.amount
          },
          currency: 'INR'
        },
        transaction: t
        }).then(rowUpdated => {
          if (rowUpdated[0] === 0) {
            throw new CError({
              message: 'Low balance.',
              code: 703,
              status: 406,
              name: 'Low Balance'
            })
          }
          return transactionRecord
        })
    })
  }).then(result => {
    // console.log('Transaction has been committed')
    return result
  }).catch(err => {
    // console.log('Transaction has been rolled back')
    throw new CError(err)
  })
}

function creditTransfer (data, columnKey) {
  const self = this

  if (data.type !== 'CR') {
    throw new CError(
      {
        message: 'Inappropriate transaction type',
        code: 703,
        status: 406,
        name: 'Internal Wallet'
      }
    )
  }

  return self.Sequelize.transaction(function (t) {
    const transactionData = Schema.validateTransaction(data)
    const totalAmount = transactionData.amount
    return self.TransactionModel
      .create(transactionData, {
        transaction: t
      }).then(transactionRecord => {
        const updateData = {
          amount: self.Sequelize.literal(`amount + ${totalAmount}`)
        }

        return self.WalletModel.update(
          updateData,
          {
            where: {
              userId: transactionData.userId
            },
            transaction: t
          }).then(rowUpdated => {
          if (rowUpdated[0] === 0) {
            throw Error(
              'Error occured while adding money to wallet, contact support.'
            )
          }
          return transactionRecord
        })
      }).then(result => {
        // console.log('Transaction has been committed')
        return result
      }).catch(err => {
        // console.log('Transaction has been rolled back')
        console.log(err)
        throw new CError(err)
      })
  })
}

function commitPayment (transactionData) {
  const self = this
  return self.Sequelize.transaction(function (t) {
    return self.TransactionModel.findOne({
      where: {
        id: transactionData.transactionId,
        status: 'INIT'
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    }).then(transactionRecord => {
      if (transactionRecord === null) {
        throw new CError({
          message: 'transaction could not found',
          code: 702,
          status: 406,
          name: 'Transaction non-existent'
        })
      }
      return transactionRecord.update({
        orderId : transactionData.orderId,
        status: transactionData.status,
        meta: transactionData.meta,
        note: transactionData.note
      }, { transaction: t })
    }).then(transactionRecord => {
      if (transactionData.status !== 'DONE') {
        return transactionRecord
      }
      return self.WalletModel.update(
        { 
          amount: self.Sequelize.literal(`amount + ${transactionRecord.amount}`)
        },
        {
          where: {
            userId: transactionRecord.userId
          },
          transaction: t
        }).then(rowUpdated => {
        if (rowUpdated[0] === 0) {
          throw Error(
            'Error occured while adding money to wallet, contact support.'
          )
        }
        return transactionRecord
      })
    }).catch(err => {
      throw Error(err)
    })
  })
}

function _checkWalletState (walletRecord) {
  if (walletRecord === null) {
    throw new CError({
      message: 'Wallet does not exist, contact support staff.',
      code: 701,
      status: 406,
      name: 'Wallet non-existent'
    })
  }

  if (walletRecord.status !== 'OPEN') {
    throw new CError(
      {
        message: 'Wallet is inactive, contact support staff.',
        code: 702,
        status: 406,
        name: 'Wallet Inactive'
      }
    )
  }

  return true
}

function initPayment (data, rzpRecord) {
  const self = this
  const transactionData = _serializeTransaction(data, rzpRecord)
  const serializeData = Schema.validateCreateTransaction(transactionData)
  return self.TransactionModel.create(serializeData)
}

function getTransactions (data) {
  const self = this
  const startDay = data.start
  const endDay = data.end 
  const now = Date.now()
  const startDate = now - (startDay * 3600 * 24 * 1000)
  const endDate = now - (endDay * 3600 * 24 * 1000)
  return self.TransactionModel
    .findAll({
      where: {
        userId: data.userId,
        createdAt: {
          [Op.lte]: endDate,
          [Op.gte]: startDate
        }
      }
    }).catch(err => {
      throw new CError(err)
    })
}

function getTransactionById (data) {
  const self = this
  return self.TransactionModel
    .findOne({
      where: {
        id: data.transactionId,
        userId: data.userId
      }
    }).then(transactionRecord => {
      if (transactionRecord === null) {
        throw new CError({
          message: 'transaction could not found',
          code: 702,
          status: 406,
          name: 'Transaction non-existent'
        })
      }
      return transactionRecord
    }).catch(err => {
      throw new CError(err)
    })
}


function getBalance (data) {
  const serializeData = Schema.validateBalance(data)
  return this.WalletModel.findOne(
    {
      attributes: ['amount'],
      where: {
        userId: serializeData.userId
      }
    })
}

function createWallet (data) {
  Schema.validateCreateWallet(data)
  return this.WalletModel.create(data)
}

module.exports = {
  createWallet,
  getBalance,
  debitTransfer,
  creditTransfer,
  initPayment,
  commitPayment,
  getTransactions,
  getTransactionById,
}

function _serializeTransaction (data, rzpData) {
  const transaction = {
    type: 'CR',
    currency: 'INR',
    app: data.app,
    userId: data.userId,
    to: data.to,
    from: data.from,
    cgst: data.cgst,
    igst: data.igst,
    sgst: data.sgst,
    fee: data.fee,
    code: data.code,
    ip: data.ip
  }

  if (rzpData) {
    transaction.orderId = rzpData.id
    transaction.amount = rzpData.amount
    transaction.provider = 'RZP'
  } else {
    transaction.amount = data.amount
    transaction.orderId = 'T'
    transaction.provider = 'PAYTM'
    if (data.hasOwnProperty('extra')) {
      transaction.extra = data.extra
    }
  }

  return transaction
}
