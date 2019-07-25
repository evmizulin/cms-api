const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { validate } = require('../helpers/validate')
const { isIdValid } = require('../helpers/isIdValid')
const { getDefaultProjectPermissions } = require('../helpers/getDefaultProjectPermissions')

const createPermissions = ({ permissions }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'projectId', ...Object.keys(getDefaultProjectPermissions('user'))],
    properties: {
      userId: { type: 'string', minLength: 1 },
      projectId: { type: 'string', minLength: 1 },
      ...Object.keys(getDefaultProjectPermissions('user')).reduce((res, key) => {
        res[key] = { type: 'boolean' }
        return res
      }, {}),
    },
  }
  const { valid, error } = validate(permissions, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  if (!isIdValid(permissions.userId) || !isIdValid(permissions.projectId)) {
    throw new ApiError(BAD_REQUEST, 'Unvalid userId or projectId')
  }
  return permissions
}

module.exports = { createPermissions }
