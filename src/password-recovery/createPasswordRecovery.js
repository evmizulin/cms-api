const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { validate } = require('../helpers/validate')

const createPasswordRecovery = creds => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['login'],
    properties: {
      login: { type: 'string', minLength: 1 },
    },
  }
  const { valid, error } = validate(creds, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  return creds
}

module.exports = { createPasswordRecovery }
