function response (params, code, next) {
  if (code === undefined) {
    code = 200
  }
  if (next) {
    return {
      data: params,
      next: next
    }
  } else {
    return {
      status: {
        http_status_code: code
      },
      data: params
    }
  }
}

module.exports = response
