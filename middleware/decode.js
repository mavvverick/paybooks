
const error = require('http-errors')
const {getDataByCode,getSgstByState, calcTax} = require('../utils/data')

const decode = async (req, res, next) => {
    if(req.body.code === undefined){
        return next(error(404, new Error('Business code required, provide "code"')))
    }

    let codeData, sgst
    try {
      codeData = await getDataByCode(req.body.code)
    } catch (e) {
        return next(error(404, e))
    } 

    if(req.body.hasOwnProperty('state')){
        try {
            sgst = await getSgstByState(codeData.id, req.body.state)
        } catch (e) {
            return next(error(404, e))
        }     
    }
   
    req.body = {
        ...req.body,
        ...codeData
    }

    delete req.body.id
    delete req.body.state

    req.body.sgst = calcTax(req.body.amount, sgst || 0)
    req.body.cgst = calcTax(req.body.amount, req.body.cgst  || 0)
    req.body.igst = calcTax(req.body.amount, req.body.igst  || 0)
    return next()
}

module.exports = decode
