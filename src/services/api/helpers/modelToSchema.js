const modelToSchema = model => {
  const MAP = {
    'string-line': stringToSchema,
    'string-multiline': stringToSchema,
    'string-html': stringToSchema,
    'string-markdown': stringToSchema,
    boolean: booleanToSchema,
    number: numberToSchema,
    object: objectToSchema,
    array: arrayToSchema,
    enum: enumToSchema,
    reference: referenceToSchema,
    asset: assetToSchema,
  }
  return MAP[model.type](model)
}

const stringToSchema = model => {
  const schema = { type: 'string' }
  const props = ['minLength', 'maxLength', 'pattern']
  props.forEach(item => {
    if (model.hasOwnProperty(item)) {
      schema[item] = model[item]
    }
  })
  return schema
}

const booleanToSchema = () => {
  const schema = { type: 'boolean' }
  return schema
}

const numberToSchema = model => {
  const schema = { type: 'number' }
  const props = ['minimum', 'maximum', 'exclusiveMaximum', 'exclusiveMinimum', 'multipleOf']
  props.forEach(item => {
    if (model.hasOwnProperty(item)) {
      schema[item] = model[item]
    }
  })
  return schema
}

const objectToSchema = model => {
  const schema = { type: 'object' }
  const props = ['additionalProperties', 'required']
  props.forEach(item => {
    schema[item] = model[item]
  })
  schema.properties = {}
  Object.keys(model.properties).forEach(propName => {
    schema.properties[propName] = modelToSchema(model.properties[propName])
  })
  return schema
}

const referenceToSchema = () => {
  const schema = { type: 'string', minLength: 1 }
  return schema
}

const arrayToSchema = model => {
  const schema = { type: 'array' }
  const props = ['minItems', 'maxItems', 'uniqueItems']
  props.forEach(item => {
    if (model.hasOwnProperty(item)) {
      schema[item] = model[item]
    }
  })
  if (model.items) {
    schema.items = modelToSchema(model.items)
  } else {
    /* app could work only with strict values, if model.items not set in enrty could be only empty array */
    schema.maxItems = 0
    schema.minItems = 0
  }
  return schema
}

const enumToSchema = model => {
  return { enum: model.enum.map(item => item.value) }
}

const assetToSchema = () => {
  const schema = { type: 'string', minLength: 1 }
  return schema
}

module.exports = { modelToSchema }
