const sql = require('../db/sql')
const resp = require('../lib/resp')
const error = require('http-errors')
const CError = require('../errors/cError')


function create(req, res, next){
    return sql.Code.create(req.body)
    .then(data => {
        let action = {
            table: "code",
            pk: data.id,
            userId: req.body.userId,
            body: JSON.stringify(req.body),
            lastVersion: 0
            
        }
        return sql.Action.create(action)
            .then(actionRecord => {
                return res.status(201).json(resp(data, 201))
            }).catch(err => {
                next(error(err))
            })  
    }).catch(err => {
        next(error(err))
    })
}

function findAll(req, res, next){
    return sql.Code.findAll({
        offset: (req.query.page || 0) * 25,
        limit: 25
    }).then(data => {
        return res.status(200).json(resp(data))
    }).catch(err => {
        next(error(err))
    })
}

function findOne(req, res, next){
    return sql.Code.findOne({
        where: {
            id: req.params.id 
        }
    }).then(data => {
        return res.status(200).json(resp(data))
    }).catch(err => {
        next(error(err))
    })
}

function update(req, res, next){
    currVersion = req.body.version
    req.body.version += 1
    return sql.Code.update(req.body,
        { where: { 
            id: req.params.id,
            version: currVersion
        }
    }).then(data => {
        if(data[0] !== 1){
            throw new CError({
                message: 'Unable to update record due to id or version.',
                code: 102,
                status: 406,
                name: 'Update Issue'
            })
        }
        let action = {
            table: "code",
            pk: req.params.id,
            body: JSON.stringify(req.body),
            lastVersion: req.body.version
        }
        return sql.Action.create(action)
        .then(actionRecord => {
            return res.status(202).json(resp(req.body, 202))
        }).catch(err => {
            next(error(err))
        })        
    }).catch(err => {
        next(error(err))
    })
}

function deleteOne(req, res, next){
    return sql.Code.destroy({ 
            where: { id: req.params.id }
    }).then(data => {
        return res.status(204)
    }).catch(err => {
        next(error(err))
    })
}

module.exports = {
    create,
    update,
    deleteOne,
    findAll,
    findOne
}
