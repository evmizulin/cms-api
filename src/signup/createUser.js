const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { validate } = require('../helpers/validate')

const createUser = ({ user }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['login', 'password'],
    properties: {
      login: { type: 'string', minLength: 1 },
      password: { type: 'string', minLength: 6 },
    },
  }
  const { valid, error } = validate(user, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  return user
}

module.exports = { createUser }
