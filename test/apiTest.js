//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const Models = require('../db/sql/index')
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const expect = require('chai').expect
const data = require('./helper/fixtures')
const Wallet = require('../lib/batua/index')
const { Op } = require('sequelize')

chai.use(chaiHttp);

Models.sequelize.sync()
const wallet = new Wallet({
  Sequelize: Models.sequelize,
  TransactionModel: Models.Transaction,
  WalletModel: Models.Wallet,
  Currency: 'INR'
})

//Our parent block
describe('Wallet', () => {
    // beforeEach((done) => {
    //    done()
    // });
    it('Flush db', (done) => {
        function clearDB() {
            let count = 0
            Models.sequelize.transaction(function(t) {
                var options = { raw: true, transaction: t }
                return Models.sequelize
                    .query('SET FOREIGN_KEY_CHECKS = 0', options)
                    .then(function() {
                    let raw = [ 
                        Models.sequelize.query('truncate table Books', options),
                        Models.sequelize.query('truncate table Wallets', options),
                        Models.sequelize.query('truncate table Transactions', options)
                    ]
                    return Promise.all(raw)
                    })
                    .then(function() {
                    return Models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
                })
            }).then(function() {
                var promises = [
                    data.accounts.forEach(account => {
                      wallet.create(account)
                    }),
                    Models.Wallet.update({
                        amount: 1000.00
                    },{ where: {amount: {[Op.lt]: 1} }})
                ];
    
                Promise.all(promises)
                .then(function () {
                        done();
                }).catch(done)
            })
        }
        clearDB()
    })    

    describe('/POST create wallet', () => {
        it('it should POST create wallet', (done) => {
            chai.request(server)
            .post('/v1/wallets')
            .send(data.sampleAccount)
            .end((err, res) => {
                expect(res).to.have.status(201)
                expect(res.body.data).to.have.property('userId', "10")
                expect(res.body.data).to.have.property('status', 'OPEN')
                expect(res.body.data).to.have.property('amount', 0)
                done();
            });
        });
    });  
    
    describe('/GET wallet data', () => {
        it('it should POST create wallet', (done) => {
            chai.request(server)
            .get('/v1/wallets/1')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.data).to.have.property('amount', 1000)
                done();
            });
        });
    });


    describe('/POST Financial Notes', () => {
        it('it should POST credit note', (done) => {
            chai.request(server)
            .post('/v1/wallets/notes/credit')
            .send(data.sampleCredit[0])
            .end((err, res) => {
                expect(res).to.have.status(201)
                expect(res.body.data).to.have.property('status', 'DONE')
                done();
            });
        });

        it('it should POST debit note', (done) => {
            chai.request(server)
            .post('/v1/wallets/notes/debit')
            .send(data.sampleDebit)
            .end((err, res) => {
                expect(res).to.have.status(201)
                expect(res.body.data).to.have.property('status', 'DONE')
                done();
            });
        });
    });

    describe('/GET Transactions & details', () => {
        it('it should Get  user\'s transactions', (done) => {
            chai.request(server)
            .get('/v1/wallets/d0e539b8-4c72-4c59-aefb-a7b5ed91616a/transactions?start=10&end=0')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.data).to.have.length(2)
                done();
            });
        });

        it('it should Get user\'s transaction by Id', (done) => {
            chai.request(server)
            .get('/v1/wallets/d0e539b8-4c72-4c59-aefb-a7b5ed91616a/transactions/1')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.data).to.include(data.transactionResponse);
                done();
            });
        });

    });


    describe('/Post Paytm gateway purchase', () => {
        it('it should POST init transaction', (done) => {
            paymentData = data.paymentInitData
            paymentData.code = "dom-3"
            paymentData.gateway = "PAYTM"
            paymentData.state = "UP"
            chai.request(server)
            .post('/v1/wallets/payments/init')
            .send(paymentData)
            .end((err, res) => {
                return Models.Transaction.update({
                    id: 790
                }, {
                    where: {
                        provider: 'PAYTM'
                    }
                }).then(data => {
                    expect(res).to.have.status(201)
                    expect(res.body.data.meta).to.not.be.null
                    expect(res.body.data).to.include({
                        status: 'INIT',
                        provider: 'PAYTM',
                        code: 'dom-3',
                        ip: '127.0.0.1',
                        type: 'CR'
                    });
                    done();
                }).catch(done)
            });
        });

        it('it should POST validate transaction', (done) => {
            chai.request(server)
            .post('/v1/wallets/payments/vaildate')
            .send(data.paytmValidData)
            .end((err, res) => {
                expect(res).to.have.status(202)
                expect(res.body.data).to.include({
                    status: 'DONE',
                    ip: '127.0.0.1',
                    meta: 'WALLET|PPI|WALLET62950085',
                    note: '01|TXN_SUCCESS|Txn Success'
                });
                done();
            });
        });
    });


    describe('/Post Razorpay gateway purchase', () => {
        it('it should POST init transaction', (done) => {
            paymentData = data.paymentInitData
            paymentData.code = "dom-4"
            paymentData.gateway = "RZP"
            paymentData.state = "MP"
            chai.request(server)
            .post('/v1/wallets/payments/init')
            .send(paymentData)
            .end((err, res) => {
                return Models.Transaction.update({
                    id: 793,
                    orderId: 'order_FLoefRa6rBn7TO'
                }, {
                    where: {
                        provider: 'RZP'
                    }
                }).then(data => {
                    expect(res).to.have.status(201)
                    expect(res.body.data.meta).to.not.be.null
                    expect(res.body.data).to.include({
                        status: 'INIT',
                        provider: 'RZP',
                        code: 'dom-4',
                        ip: '127.0.0.1',
                        type: 'CR'
                    });
                    done();
                }).catch(done)
            });
        });

        it('it should POST validate transaction', (done) => {
            chai.request(server)
            .post('/v1/wallets/payments/vaildate')
            .send(data.rzpValidData)
            .end((err, res) => {
                expect(res).to.have.status(202)
                expect(res.body.data).to.include({
                    status: 'DONE',
                    ip: '127.0.0.1',
                    meta: 'pay_FLogcdu6cRXPI0'
                });
                done();
            });
        });
    });

});