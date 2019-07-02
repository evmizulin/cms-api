const { validate } = require('../helpers/validate')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')

const createEmailConfirmCreds = ({ creds }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['activationToken'],
    properties: {
      activationToken: { type: 'string', minLength: 1 },
    },
  }
  const { valid, error } = validate(creds, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  return creds
}

module.exports = { createEmailConfirmCreds }
