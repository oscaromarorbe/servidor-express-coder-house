const isNullOrUndefined = arg => {
  if (arg === null || arg === undefined || arg === NaN) return true
  return false
}

module.exports = { isNullOrUndefined }
