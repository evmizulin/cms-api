const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class ObjectModelType extends ModelType {
  constructor(model, options) {
    super(model, options)
    Object.keys(model.properties).forEach(propName => {
      this.properties[propName] = this._createModel(model.properties[propName], {
        noId: true,
        noApiId: true,
        models: options.models,
        createModel: options.createModel,
      })
    })
  }

  _validate(model, options) {
    const { valid, error } = this._validateBySchema(model, options)
    if (!valid) return { valid, error }

    const { valid: validU, error: errorU } = this._validateRequireqFields(model)
    if (!validU) return { valid: validU, error: errorU }

    return { valid: true, error: null }
  }

  _validateBySchema(model, options) {
    const schema = getBasicSchema(options)
    schema.required.push('additionalProperties', 'required', 'properties')
    Object.assign(schema.properties, {
      type: { enum: ['object'] },
      additionalProperties: { enum: [false] },
      required: { type: 'array', uniqueItems: true, items: { type: 'string', minLength: 1 } },
      properties: { type: 'object' },
    })
    return tv4.validateResult(model, schema)
  }

  _validateRequireqFields(model) {
    const valid = model.required.every(field => model.properties[field])
    return { valid, error: valid ? null : { message: `Field required but doesn't exist in properties` } }
  }
}

module.exports = { ObjectModelType }
