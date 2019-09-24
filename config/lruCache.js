const LRU = require('lru-cache')

const options = {
  max: 100,
  maxAge: 1000 * 60 * 30
}
const cache = new LRU(options)

module.exports = cache
