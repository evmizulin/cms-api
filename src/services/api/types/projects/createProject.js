const { ApiError } = require('../../../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { validate } = require('../../../../helpers/validate')
const { isIdValid } = require('../../../../helpers/isIdValid')

const createProject = ({ project, noId = false }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['id', 'name'],
    properties: {
      id: { type: 'string', minLength: 1 },
      name: { type: 'string', minLength: 1 },
    },
  }
  if (noId) {
    schema.required = schema.required.filter(item => item !== 'id')
    delete schema.properties.id
  }
  const { valid, error } = validate(project, schema)
  if (!valid) {
    throw new ApiError(BAD_REQUEST, error)
  }
  if (!noId && !isIdValid(project.id)) {
    throw new ApiError(BAD_REQUEST, 'ID is not valid')
  }
  return project
}

module.exports = { createProject }
