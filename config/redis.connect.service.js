const redis = require('redis')
const bluebird = require('bluebird')

let client
if (process.env.NODE_ENV === 'test') {
  client = redis.createClient()
} else {
  client = redis.createClient(process.env.REDIS_URL)
}

/*
    Adding bluebird promises to the redis library
*/
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// Checking if the connection is on or not
client.on('connect', () => {
  console.log('Redis connection successful')
})

client.on('error', err => {
  console.log('Error in Redis connection -- ' + err)
})

// client.hmset('shubh', 'user', JSON.stringify({
//     name: "shubh",
//     username: "shubh123",
//     email: "s@g"
// }))

// client.hgetallAsync('shubh')
//     .then(user => {
//         console.log(JSON.parse(user.user))
//     })

// client.delAsync('shubh')
//     .then(r => {
//         console.log(r)
//     })

module.exports = client
