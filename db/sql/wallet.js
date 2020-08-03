'use strict'
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    app: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00
      }
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'INR'
    },
    bank: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    bankType: {
      type: DataTypes.STRING,
      values: ['CURRENT', 'SAVING', null],
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM,
      values: ['OPEN', 'FROZEN', 'CLOSED', 'PENDING'],
      defaultValue: 'OPEN'
    }
  }, {
    getterMethods: {
      // totalBalance () {
      //   return this.deposited + this.winnings
      // },
      // allowedBonus () {
      //   const allowedBonus = (this.bonus * 10) / 100

      //   if (allowedBonus > 10) {
      //     return 10
      //   }
      //   return allowedBonus
      // }
    },
    setterMethods: {
      fullName (value) {
        const names = value.split(' ')
        this.setDataValue('firstname', names.slice(0, -1).join(' '))
        this.setDataValue('lastname', names.slice(-1).join(' '))
      }
    }

    // paranoid: true
  })

  Wallet.prototype.checkBalanceForDebit = function checkBalanceForDebit (amount, category) {
    let totalAllowedBalance = null

    if (category === 'WITHDRAWL') {
      totalAllowedBalance = this.winnings
    } else {
      totalAllowedBalance = this.deposited + this.winnings + this.allowedBonus
    }

    if (totalAllowedBalance < amount) {
      return false
    }

    return true
  }

  Wallet.prototype.debitUpdateData = function debitUpdateData (amount, category) {
    const data = {}

    if (category === 'WITHDRAWL') {
      data.winnings = amount
      return data
    }

    let allowedBonus = (amount * 10) / 100
    let tempAmount = amount

    if (this.bonus >= allowedBonus) {
      if (allowedBonus > 25) {
        allowedBonus = 25
      }
      data.bonus = allowedBonus
      tempAmount = tempAmount - allowedBonus
    } else if (this.bonus > 0) {
      data.bonus = this.bonus
      tempAmount = tempAmount - this.bonus
    }

    if (this.deposited >= amount) {
      data.deposited = tempAmount
      tempAmount = 0
    } else {
      data.deposited = this.deposited
      tempAmount = tempAmount - this.deposited
    }

    if (tempAmount > 0 && this.winnings >= tempAmount) {
      data.winnings = tempAmount
    }

    if (amount === sum(data)) {
      return data
    } else {
      return false
    }
  }

  Wallet.associate = (models) => {
    Wallet.hasMany(models.Book, { 
      foreignKey: 'wId'
    });
  }

  return Wallet
}

function sum (obj) {
  var sum = 0
  for (var el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseFloat(obj[el])
    }
  }
  return sum
}
