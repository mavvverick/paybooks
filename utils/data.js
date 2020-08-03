
const sql = require('../db/sql')
const lruCache = require('../config/lruCache')
const CODEPREFIX = process.env.CODE_PREFIX + '-'
function getSgstByState (codeId, state) {
  key = `sg-${codeId}-${state}`
  if (lruCache.peek(key)) {
    return lruCache.get(key)
  }

  return sql.Tax.findOne({
    where: {
      codeId: codeId,
      state: state
    },
    attributes: ['sgst']
  }).then(tax => {
    let taxJson = 0
    if(tax){
      taxJson = tax.toJSON()
    }
    lruCache.set(key, taxJson.sgst)
    return taxJson.sgst
  })
}

function getDataByCode (codes) {
  keyList = codes.split(CODEPREFIX)
  if (keyList.length !== 2) {
    throw Error('Not valid code')
  }
  key = `c-${keyList[1]}`
  if (lruCache.peek(key)) {
    return lruCache.get(key)
  }

  return sql.Code.findOne({
    // include: [{
    //   model: sql.Tax,
    //   attributes: ['state', 'sgst']
    // }],
    where: {
        id: keyList[1]
    },
    attributes: { exclude: ['isActive','createdAt','deletedAt', 'updatedAt','version'] }
  }).then(data => {
    if (!data) {
      throw Error('Not valid code')
    }
    let dataJson = data.toJSON()
    lruCache.set(key, dataJson)
    return dataJson
  })
}

function getAccess (secret) {
  key = `ac-${secret}`
  if (lruCache.peek(key)) {
    return lruCache.get(key)
  }

  return sql.Access.findOne({
    where: {
      secret: secret
    },
    attributes: ['level']
  }).then(access => {
    if(access){
      accessLevel = access.toJSON()
      lruCache.set(key, accessLevel.level)
      return accessLevel.level
    }
    return false
  })
}


function calcTax(amount, taxPerct){
  return (taxPerct * amount) / 100
}


module.exports = {
  getSgstByState,
  getDataByCode,
  calcTax,
  getAccess
}
