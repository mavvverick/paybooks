'use strict'
module.exports = (sequelize, DataTypes) => {
  const Code = sequelize.define('Code', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    app: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'SELF'
    },
    meta: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
    fee: {
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
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    paranoid: true
  })

  Code.associate = (models) => {
    Code.hasMany(models.Tax,{ foreignKey: 'codeId'});
  }
 
  return Code
}

