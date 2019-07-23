const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { validate } = require('../helpers/validate')
const { isIdValid } = require('../helpers/isIdValid')

const createUser = ({ user }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['id', 'login'],
    properties: {
      id: { type: 'string', minLength: 1 },
      login: { type: 'string', minLength: 1 },
    },
  }
  const { valid, error } = validate(user, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  if (!isIdValid(user.id)) {
    throw new ApiError(BAD_REQUEST, 'Unvalid user id')
  }
  return user
}

module.exports = { createUser }
