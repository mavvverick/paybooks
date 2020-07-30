
const Paytm = require('paytm-pg-node-sdk')
var environment = Paytm.LibraryConstants.PRODUCTION_ENVIRONMENT
if (process.env.NODE_ENV !== 'production') {
  environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT
}

var mid = process.env.PAYTM_MID
var key = process.env.PAYTM_MERCHANT_KEY
var website = 'https://yolobus.in'
var clientId = process.env.PAYTM_WEBSITE
var callbackUrl = process.env.PAYTM_CALLBACK
Paytm.MerchantProperties.setCallbackUrl(callbackUrl)
Paytm.MerchantProperties.initialize(environment, mid, key, clientId, website)
