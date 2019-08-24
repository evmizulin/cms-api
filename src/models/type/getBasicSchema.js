const getBasicSchema = ({ noId, noApiId }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['id', 'title', 'apiId', 'type'],
    properties: {
      id: { type: 'string', minLength: 1 },
      title: { type: 'string', minLength: 1 },
      apiId: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
    },
  }
  if (noApiId) {
    schema.required = schema.required.filter(item => item !== 'apiId')
    delete schema.properties.apiId
  }
  if (noId) {
    schema.required = schema.required.filter(item => item !== 'id')
    delete schema.properties.id
  }
  return schema
}

module.exports = { getBasicSchema }
