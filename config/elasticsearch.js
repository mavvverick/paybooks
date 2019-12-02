var elasticsearch = require('elasticsearch')
var elasticClient = new elasticsearch.Client({
  host: process.env.ELASTIC_URL,
  // log: 'trace',
  apiVersion: process.env.ELASTIC_VERSION // use the same version of your Elasticsearch instance
})

module.exports = {
  ping: function (req, res) {
    elasticClient.ping({
      requestTimeout: 30000
    }, function (error) {
      if (error) {
        res.status(500)
        return res.json({ status: false, msg: 'Elasticsearch cluster is down!' })
      } else {
        res.status(200)
        return res.json({ status: true, msg: 'Success! Elasticsearch cluster is up!' })
      }
    })
  },

  // 1. Create index
  initIndex: function (req, res, indexName) {
    elasticClient.indices.create({
      index: indexName
    }).then(function (resp) {
      // console.log(resp);
      res.status(200)
      return res.json(resp)
    }, function (err) {
      // console.log(err.message);
      res.status(500)
      return res.json(err)
    })
  },

  // 2. Check if index exists
  indexExists: function (req, res, indexName) {
    elasticClient.indices.exists({
      index: indexName
    }).then(function (resp) {
      // console.log(resp);
      res.status(200)
      return res.json(resp)
    }, function (err) {
      // console.log(err.message);
      res.status(500)
      return res.json(err)
    })
  },

  // 3.  Preparing index and its mapping
  initMapping: function (req, res, indexName, docType, payload) {
    elasticClient.indices.putMapping({
      index: indexName,
      type: docType,
      body: payload
    }).then(function (resp) {
      res.status(200)
      return res.json(resp)
    }, function (err) {
      res.status(500)
      return res.json(err)
    })
  },

  // 4. Add/Update a document
  addDocument: function (req, res, indexName, _id, docType, payload) {
    elasticClient.index({
      index: indexName,
      type: docType,
      id: _id,
      body: payload
    }).then(function (resp) {
      // console.log(resp);
      res.status(200)
      return res.json(resp)
    }, function (err) {
      // console.log(err.message);
      res.status(500)
      return res.json(err)
    })
  },

  // 5. Update a document
  updateDocument: function (index, _id, payload) {
    return elasticClient.update({
      index: index,
      id: _id,
      body: payload
    })
  },

  // 6. Search
  search: function (data) {
    // {
    //   index: indexName,
    //   filter_path: 'aggs.**.sum_bucket',
    //   body: payload
    // }
    return elasticClient.search(data)
  },

  bulk: function (body) {
    return elasticClient.bulk({
      body: body
    })
  },

  // Delete a document from an index
  deleteDocument: function (req, res, index, _id, docType) {
    elasticClient.delete({
      index: index,
      type: docType,
      id: _id
    }, function (err, resp) {
      if (err) return res.json(err)
      return res.json(resp)
    })
  },

  // Delete all
  deleteAll: function (req, res) {
    elasticClient.indices.delete({
      index: '_all'
    }, function (err, resp) {
      if (err) {
        console.error(err.message)
      } else {
        console.log('Indexes have been deleted!', resp)
        return res.json(resp)
      }
    })
  }

// [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx]
}
