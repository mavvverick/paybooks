'use strict'
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
// const env = process.env.NODE_ENV || 'development'
// const config = require('../config/config.json')[env]
const db = {}

// if (config.use_env_constiable) {
//   var sequelize = new Sequelize(JSON.parse(process.env[config.use_env_constiable]));
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

const sequelize = new Sequelize(process.env.sequelize_db, process.env.sequelize_user, process.env.sequelize_pass, {
  host: process.env.sequelize_host,
  dialect: 'mysql',
  logging: false
})

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

sequelize.sync()
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
