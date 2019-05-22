const getSchema = (properties, { noId, isSub }) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['id', 'modelId', 'value', 'identificator'],
    properties: {
      id: { type: 'string', minLength: 1 },
      modelId: { type: 'string', minLength: 1 },
      identificator: { type: 'string' },
      value: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'value'],
        properties,
      },
    },
  }
  if (noId) {
    schema.required = schema.required.filter(item => item !== 'id')
    delete schema.properties.id
  }
  if (isSub) {
    return schema.properties.value
  }
  return schema
}

module.exports = { getSchema }
