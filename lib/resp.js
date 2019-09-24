function response (params, next) {
  if (next) {
    return {
      data: params,
      next: next
    }
  } else {
    return {
      data: params
    }
  }
}

module.exports = response
