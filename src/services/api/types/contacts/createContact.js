const tv4 = require('tv4')
const { ApiError } = require('../../../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')

const createContact = contact => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
      email: { type: 'string', minLength: 1, maxLength: 300, pattern: '/@/g' },
      phone: { type: 'string', minLength: 1, maxLength: 300 },
      name: { type: 'string', minLength: 1, maxLength: 300 },
      jobTitle: { type: 'string', minLength: 1, maxLength: 300 },
      company: { type: 'string', minLength: 1, maxLength: 300 },
    },
  }
  const { valid, error } = tv4.validateResult(contact, schema)
  if (!valid) {
    throw new ApiError(error.message, BAD_REQUEST)
  }
  return contact
}

module.exports = { createContact }
