var http = require('https')

module.exports = function (phone, msg) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'POST',
      hostname: 'api.msg91.com',
      port: null,
      path: '/api/v2/sendsms?country=91',
      headers: {
        authkey: process.env.KEY_MSG91,
        'content-type': 'application/json'
      }
    }

    var req = http.request(options, function (res) {
      var chunks = []

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', function () {
        var body = Buffer.concat(chunks)
        resolve(body.toString())
      })
    })

    req.write(JSON.stringify({
      sender: 'YOLOTR',
      route: '4',
      country: '91',
      sms: [{ message: msg, to: [phone] }]
    }))

    req.on('error', (err) => reject(err))
    req.end()
  })
}
