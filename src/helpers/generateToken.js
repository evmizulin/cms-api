const hash = require('object-hash')

const generateToken = () =>
  hash(
    Array(10)
      .fill(0)
      .reduce(res => res + Math.random(), '')
  )

module.exports = { generateToken }
