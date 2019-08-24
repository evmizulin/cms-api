const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class BooleanModelType extends ModelType {
  _validate(model, options) {
    const schema = getBasicSchema(options)
    schema.required.push('default')
    Object.assign(schema.properties, {
      type: { enum: ['boolean'] },
      default: { type: 'boolean' },
    })
    return tv4.validateResult(model, schema)
  }
}

module.exports = { BooleanModelType }
