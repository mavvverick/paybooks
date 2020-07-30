let mongoose = require('mongoose');

let Wallet = new mongoose.Schema({
	userId: String,
	walletId: String,
	balance: Number,
	currency: String,
	effectiveBalance: Number,
	status: {
		type: String,
		enum: ['OPEN', 'FROZEN', "CLOSED"]
	},
	isActive: Boolean,
	pendingTransactions: [],
}, {
	timestamps: true
})

let Transaction = new mongoose.Schema({
	userId: String,
	tourId: String,
	currency: String,
	amount: Number,
	fee: Number,
	text: String,
	meta: String,
	extra: String,
	type: {
		type: String,
		enum: ['DR', 'CR']
	},
	category: {
		type: String,
		enum: ['DEPOSIT', 'WITHDRAWL', "MATCH"]
	},
	state: {
		type: String,
		enum: ['INIT', 'PENDING', "COMMITED",
			'DONE', 'COMPLETED', 'CANCEL',
			'FAILED'
		],
		default: 'INIT'
	}
}, {
	timestamps: true
})

Transaction.methods.updateState = function (state) {

	return this.model('Transaction').findByIdAndUpdate({
		_id: this._id
	}, {
		$set: {
			state: state
		}
	}).exec()
}

let Dummy = new mongoose.Schema({
	matchId: {
		type: String,
		unique: true,
		index: true
	},
	name: String
})

exports.Dummy = mongoose.model('Dummy', Dummy)
exports.Wallet = mongoose.model('Wallet', Wallet);
exports.Transaction = mongoose.model('Transaction', Transaction);
