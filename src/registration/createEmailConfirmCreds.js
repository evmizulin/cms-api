const { validate } = require('../helpers/validate')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')

const createEmailConfirmCreds = ({ token }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['confirmationToken'],
    properties: {
      confirmationToken: { type: 'string', minLength: 1 },
    },
  }
  const { valid, error } = validate(token, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  return token
}

module.exports = { createEmailConfirmCreds }
