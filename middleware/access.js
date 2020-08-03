
const error = require('http-errors')
const {getAccess} = require('../utils/data')

const access = async (req, res, next) => {
    if(process.env.NODE_ENV !== 'production'){
        return next()
    }

    if(req.headers['x-paybooks-secret'] === undefined){
        return next(error(401, new Error('Paybooks access secret required.')))
    }

    let level
    try {
        level = await getAccess(req.headers['x-paybooks-secret'])
    } catch (e) {
        return next(error(404, e))
    } 


    if(level !== 1){
        return next(error(401, Error('Unauthorised Access.')))
    }

    return next()
}

module.exports = access
