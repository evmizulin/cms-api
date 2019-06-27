const tv4 = require('tv4')

const validate = (value, schema) => {
  const { valid, error } = tv4.validateResult(value, schema)
  return { valid, error: error ? error.message : null }
}

module.exports = { validate }
