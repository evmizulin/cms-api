const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class ArrayModelType extends ModelType {
  constructor(model, options) {
    super(model, options)
    if (model.items) {
      this.items = this._createModel(model.items, {
        noId: true,
        noApiId: true,
        models: options.models,
        createModel: options.createModel,
      })
    }
  }

  _validate(model, options) {
    const schema = getBasicSchema(options)
    schema.required.push('uniqueItems')
    Object.assign(schema.properties, {
      type: { enum: ['array'] },
      minItems: { type: 'integer', minimum: 0 },
      maxItems: { type: 'integer', minimum: 0 },
      uniqueItems: { enum: [false] },
      items: { type: 'object' },
    })
    return tv4.validateResult(model, schema)
  }
}

module.exports = { ArrayModelType }
