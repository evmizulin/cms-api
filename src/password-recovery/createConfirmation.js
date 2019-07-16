const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { validate } = require('../helpers/validate')

const createConfirmation = creds => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['password', 'token'],
    properties: {
      password: { type: 'string', minLength: 6 },
      token: { type: 'string', minLength: 1 },
    },
  }
  const { valid, error } = validate(creds, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  return creds
}

module.exports = { createConfirmation }
