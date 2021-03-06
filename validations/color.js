function isHex(str) {
  return /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(str)
}

function validColor(str) {
  return (str && str.length === 6) ? isHex(str) : false
}

module.exports = validColor
