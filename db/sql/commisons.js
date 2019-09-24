'use strict'
module.exports = (sequelize, DataTypes) => {
  const Commission = sequelize.define('Commission', {
    tid: DataTypes.INTEGER,
    bookVal: DataTypes.INTEGER,
    amt: DataTypes.INTEGER
  }, {
    timestamp: true,
    paranoid: true
  })

  return Commission
}
