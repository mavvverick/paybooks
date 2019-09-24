// `use strict`
const mongoose = require('mongoose')
// const chalk = require('chalk'); //chalk.red('✗')

/**
 * Connect to MongoDB.
 */

let MongoUrl = ''
if (process.env.NODE_ENV === 'test') {
  MongoUrl = process.env.MONGODB_URI_TEST
} else {
  MongoUrl = process.env.MONGODB_URI_DEV
}
mongoose.Promise = require('bluebird')
mongoose.connect(MongoUrl, {
  useNewUrlParser: true
})
// mongoose.set('debug', true)
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.')
  process.exit()
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection is disconnected')
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection is disconnected due to application termination')
    process.exit(0)
  })
})

// https://github.com/Automattic/mongoose/issues/6880
mongoose.set('useFindAndModify', false)
