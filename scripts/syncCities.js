require('dotenv').config()
const sql = require('../db/sql')
const elastic = require('../config/elasticsearch')

init()

function init () {
  sql.City.findAll({}).then(cities => {
    const bulkdata = []
    cities.forEach(city => {
      const idx = { index: { _index: 'cities', _id: city.id } }
      const data = { name: city.name, id: city.id }
      bulkdata.push(idx, data)
    })
    return elastic.bulk(bulkdata)
      .then(data => {
        console.log(data)
      })
  }).catch(err => {
    console.log(err)
  })
}
