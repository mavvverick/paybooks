`use strict`
const mongoose = require('mongoose');
//const chalk = require('chalk'); //chalk.red('✗')

/**
 * Connect to MongoDB.
 */
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, {
		auth: {
			user: process.env.MONGODB_USER,
			password: process.env.MONGODB_PASS
		}
	})
	.then(() => console.log('connection successful'))
	.catch((err) => {
		console.error(err);
		process.exit()
	});


// const MongoClient = require('mongo-mock').MongoClient;
// MongoClient.persist = "mongo.js"; //persist the data to disk

// module.exports = function () {
// 	return new Promise(function (resolve, reject, collection) {
// 		MongoClient.connect(url, {}, function (err, db) {
// 			if (err) {
// 				reject(err)
// 			}
// 			resolve(db)
// 		})
// 	})
// }
