function getVpaAddress (userID) {
  return `YOLO${userID}`
}

function getUpiAddress (userID) {
  return `YOLO${userID}.04@cmsidfc`
}

function getUserIdfromVpaAddress (str) {
  const vpa = str.split('YOLO')
  if (vpa.length === 1 && isNaN(parseInt(vpa[0]))) {
    return vpa[0]
  }
  return false
}

function getUserIdfromUpiAddress (str) {
  const upi = str.split('.04@cmsidfc').split('YOLO')
  if (upi.length === 1 && isNaN(parseInt(upi[0]))) {
    return upi[0]
  }
  return false
}

module.exports = {
  getVpaAddress,
  getUpiAddress,
  getUserIdfromVpaAddress,
  getUserIdfromUpiAddress
}
