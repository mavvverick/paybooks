'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    phNumber: {
      type: DataTypes.STRING(12),
      unique: true
    },
    otp: DataTypes.STRING(50),
    isVerified: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    firstTimeUser: DataTypes.BOOLEAN,
    avatarUrl: DataTypes.STRING(20),
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    androidId: {
      type: DataTypes.STRING(75),
      defaultValue: null
    },
    imeiNumber: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    model: {
      type: DataTypes.STRING(100),
      defaultValue: null
    },
    referCode: {
      type: DataTypes.STRING(24),
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
      type: DataTypes.TEXT,
      defaultValue: null
    }
  }, {
    paranoid: true
  })

  return User
}
