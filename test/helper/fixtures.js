const data = {
  users: [
    '1',
    '2',
    '3',
    '4',
    'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    'b6b7ad89-578b-470a-97ba-bbe87a1a64ec'
  ],
  accounts: [{
    userId: '1',
    app: 'BUS'
  },{
    userId: '2',
    app: 'BUS'
  },{
    userId: '3',
    app: 'BUS'
  },{
    userId: '4',
    app: 'BUS'
  },{
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    app: 'BUS'
  }, {
    userId: 'b6b7ad89-578b-470a-97ba-bbe87a1a64ec',
    app: 'BUS'
  }],
  sampleAccount: {
    userId: '10',
    app: 'BUS'
  },
  sampleDebit: {
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    app: 'BUS',
    code: 'dom-2',
    amount: 8.00,
    fee: 2.00,
    meta: 'match G123',
    note: '',
    ip: '122.99.127.22'
  },
  sampleCredit: [{
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    code: 'dom-1',
    amount: 20.00,
    fee: 0.00,
    meta: 'signup',
    note: '',
    ip: '122.99.127.22'
  }, {
    userId: 'b6b7ad89-578b-470a-97ba-bbe87a1a64ec',
    code: 'dom-1',
    amount: 20.00,
    fee: 0.00,
    meta: 'signup',
    note: '',
    ip: '122.99.127.45'
  }],
  creditData: {
    userId: 'b6b7ad89-578b-470a-97ba-bbe87a1a64ec',
    code: 'dom-1',
    orderId: 'G123',
    currency: 'INR',
    meta: 'xxxxx',
    amount: 15.50,
    fee: 4.50,
    note: '4b1ee12c-0b4a-461a-839f-86240d3356b9',
    ip: '122.99.127.22'
  },
  withdrawl: {
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    orderId: '',
    currency: 'INR',
    app: 'BUS',
    provider: 'SELF',
    meta: 'xxxxx',
    amount: 90,
    fee: 0.30,
    note: '',
    ip: '122.99.127.22'
  },
  paymentInitData: {
    "app": "BUS",
    "phoneNumber":"7777777777",
    "amount": 10.00,
    "fee":0.00,
    "meta":"ticket 123",
    "category":"BOOKING",
    "ip":"127.0.0.1",
    "gateway": "PAYTM",
    "userId": "d0e539b8-4c72-4c59-aefb-a7b5ed91616a"
  },
  paytmValidData:{ 
    "CURRENCY": "INR",
    "GATEWAYNAME": "WALLET",
    "RESPMSG": "Txn Success",
    "BANKNAME": "WALLET",
    "PAYMENTMODE": "PPI",
    "MID": "YoloBu09321308240124",
    "RESPCODE": "01",
    "TXNID": "20200730111212800110168880401758157",
    "TXNAMOUNT": "10.00",
    "ORDERID": "790",
    "STATUS": "TXN_SUCCESS",
    "BANKTXNID": "62950085",
    "TXNDATE": "2020-07-30 19:06:03.0",
    "CHECKSUMHASH":
     "QGWzfF2ekbefkC2PlWzdTw5O0A8ihuiO8FoKtakqhey5V0rNk3bI+IIosWuROv22r3z3oEix6vCpIBKkGXryuK5Y+/GrBxVLhu9Xr80F718=" 
  },
  paytmValidFailedData: { 
    BANKTXNID: "",
    CHECKSUMHASH:
    "Oye6T9oX0cFzplZvtdF3UKn9kFrMnwTutVK1nXiUR9pBgSoR15rPN2IRK8qXpAMQ+CL1XwNxXSWD5oZ/3yS6LLOgpL09uRidml6zKVrnjAk=",
    CURRENCY: "INR",
    MID: "YoloBu09321308240124",
    ORDERID: "786",
    RESPCODE: "501",
    RESPMSG:
    "Your payment has been declined by your bank. Please contact your bank for any queries. If money has been deducted from your account, your bank will inform us within 48 hrs and we will refund the same",
    STATUS: "TXN_FAILURE",
    TXNAMOUNT: "10.00" 
  },
  rzpValidData: {
    "transactionId":"793",
    "razorpay_payment_id": "pay_FLogcdu6cRXPI0",
    "razorpay_order_id": "order_FLoefRa6rBn7TO",
    "razorpay_signature": "021e3636da10ecf59cacbb80af6188e201d575875173bf98b1a46fe4e2994f42"
  },
  user1Trac: {
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    gameId: 1,
    app: 'BUS',
    currency: 'INR',
    amount: 10.00,
    fee: 0.00,
    meta: '',
    ip: '122.99.127.45'
  },
  user2Trac: {
    userId: 'b6b7ad89-578b-470a-97ba-bbe87a1a64ec',
    gameId: 1,
    app: 'MGPL',
    currency: 'INR',
    amount: 10.00,
    fee: 0.00,
    meta: '',
    ip: '122.99.127.45'
  },
  transactionResponse: { id: 1,
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    to: '2',
    from: '3',
    orderId: null,
    amount: 20,
    refundAmount: 0,
    tax: 0,
    sgst: 0,
    cgst: 0.6,
    igst: 0.6,
    fee: 0,
    meta: 'credit note',
    note: '',
    extra: null,
    refund: null,
    app: 'BUS',
    provider: 'SELF',
    ip: '122.99.127.22',
    type: 'CR',
    code: 'dom-1',
    status: 'DONE',
    linkId: null }
}

module.exports = data
