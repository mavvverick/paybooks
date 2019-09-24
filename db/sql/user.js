'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    phNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    otp: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    firstTimeUser: DataTypes.BOOLEAN,
    avatarUrl: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      defaultValue: true
    },
    isBlocked: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    androidId: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    imeiNumber: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    model: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    referCode: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    tokens: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isAgent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    commPerct: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    gst: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  }, {
    paranoid: true
  })

  return User
}
