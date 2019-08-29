const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { validate } = require('../helpers/validate')
const { getDefaultProjectPermissions } = require('../helpers/getDefaultProjectPermissions')

const createPermissions = ({ permissions }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: Object.keys(getDefaultProjectPermissions('user')),
    properties: Object.keys(getDefaultProjectPermissions('user')).reduce((res, key) => {
      res[key] = { type: 'boolean' }
      return res
    }, {}),
  }
  const { valid, error } = validate(permissions, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  return permissions
}

module.exports = { createPermissions }
