const data = {
  users: [
    'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    'b6b7ad89-578b-470a-97ba-bbe87a1a64ec'
  ],
  accounts: [{
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    app: 'BUS'
  }, {
    userId: 'b6b7ad89-578b-470a-97ba-bbe87a1a64ec',
    app: 'BUS'
  }],
  debitData: {
    app: 'BUS',
    amount: 8.00,
    fee: 2.00,
    meta: 'match G123',
    note: ''
  },
  sampleCredit: [{
    userId: 'd0e539b8-4c72-4c59-aefb-a7b5ed91616a',
    app: 'BUS',
    provider: 'SELF',
    category: 'DEPOSIT',
    amount: 20.00,
    fee: 0.00,
    meta: 'signup',
    note: '',
    ip: '122.99.127.22'
  }, {
    userId: 'b6b7ad89-578b-470a-97ba-bbe87a1a64ec',
    app: 'BUS',
    provider: 'SELF',
    amount: 20.00,
    category: 'REFER',
    fee: 0.00,
    meta: 'signup',
    note: '',
    ip: '122.99.127.45'
  }],
  creditData: {
    userId: 'b6b7ad89-578b-470a-97ba-bbe87a1a64ec',
    orderId: 'G123',
    currency: 'INR',
    app: 'BUS',
    provider: 'SELF',
    category: 'DEPOSIT',
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
    category: 'WITHDRAWAL',
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
  // paytmValidData:{ 
  //   "CURRENCY": "INR",
  //   "GATEWAYNAME": "WALLET",
  //   "RESPMSG": "Txn Success",
  //   "BANKNAME": "WALLET",
  //   "PAYMENTMODE": "PPI",
  //   "MID": "YoloBu09321308240124",
  //   "RESPCODE": "01",
  //   "TXNID": "20200730111212800110168880401758157",
  //   "TXNAMOUNT": "10.00",
  //   "ORDERID": "790",
  //   "STATUS": "TXN_SUCCESS",
  //   "BANKTXNID": "62950085",
  //   "TXNDATE": "2020-07-30 19:06:03.0",
  //   "CHECKSUMHASH":
  //    "QGWzfF2ekbefkC2PlWzdTw5O0A8ihuiO8FoKtakqhey5V0rNk3bI+IIosWuROv22r3z3oEix6vCpIBKkGXryuK5Y+/GrBxVLhu9Xr80F718=" 
  // },
  
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

  paytmValidData: { 
    CURRENCY: "INR",
    GATEWAYNAME: "WALLET",
    RESPMSG: "Txn Success",
    BANKNAME: "WALLET",
    PAYMENTMODE: "PPI",
    MID: "YoloBu09321308240124",
    RESPCODE: "01",
    TXNID: "20200730111212800110168912401780028",
    TXNAMOUNT: "10.00",
    ORDERID: "793",
    STATUS: "TXN_SUCCESS",
    BANKTXNID: "62950724",
    TXNDATE: "2020-07-30 21:15:37.0",
    CHECKSUMHASH:
    "IOD0BX3Ydge8OYk3s1LWRczrMpeLdn9ri3ow+czS1OhLz5b9esdJ2m7hxDiPIVVbGJxUrYd30EPz8gwKOi86rm3zNSbmv5ZgU4nvDmBwaZY=" 
  },

  rzpValidData: {
    "transactionId":"792",
    "razorpay_payment_id": "pay_FKjrV3jsFQwojV",
    "razorpay_order_id": "order_FKjr1LOgNinOPl",
    "razorpay_signature": "b8f42eaa0ee4eac9f310c8cb112f00f5336a5ca4d95b2b8c6888c70cf1d6bf9d"
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
  }
}

module.exports = data
