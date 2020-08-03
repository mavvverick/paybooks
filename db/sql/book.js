'use strict'
var Code = require('./code');
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM,
        values: ['DR', 'CR']
    },
    amount:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: 0.00
        }
    }, 
    meta: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    paranoid: true
  })

//   Book.beforeUpdate((book, options) => {
//   //  throw Error('Cant update this model.')
//   });

  return Book
}


