const tv4 = require('tv4')
const { ApiError } = require('../../../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')

const createRecoveryCreds = creds => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['login'],
    properties: {
      login: { type: 'string', minLength: 1 },
    },
  }
  const { valid, error } = tv4.validateResult(creds, schema)
  if (!valid) {
    throw new ApiError(error.message, BAD_REQUEST)
  }
  return creds
}

module.exports = { createRecoveryCreds }
