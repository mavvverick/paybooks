require('dotenv').config()
const elastic = require('../config/elasticsearch')

init()
function init () {
  return elastic.delteByQuery({
    index: 'schedules',
    body: {
      query: {
        range: {
          travel_date: {
            lt: Date.now()
          }
        }
      }
    }
  }).then(data => {
    console.log(data)
    process.exit(1)
  }).catch(err => {
    console.log(err)
  })
}
