require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const routesv1 = require('./routes.v1/index')
const errorHandler = require('./errors/json')
const CError = require('./errors/cError')
const dataLayer = require('./middleware/dataLayer')
// require('./config/mongo.connect.service')
app.use(helmet())
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(dataLayer)

app.use('/v1', routesv1)

app.use(function (req, res, next) {
  throw new CError({
    status: 404,
    code: 100,
    message: `${req.method}  ${req.url}`
  })
})

app.use(errorHandler())

app.listen(process.env.PORT || 8080, () => {
  console.log('App listening at port ' + process.env.PORT || 4444)
})

module.exports = app

global.isObject = function (value) {
  return value && typeof value === 'object' && value.constructor === Object
}
