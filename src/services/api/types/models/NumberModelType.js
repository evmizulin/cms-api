const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class NumberModelType extends ModelType {
  _validate(model, options) {
    const { valid, error } = this._validateBySchema(model, options)
    if (!valid) return { valid, error }

    const { valid: validF, error: errorF } = this._validateExcusiveFields(model)
    if (!validF) return { valid: validF, error: errorF }

    return { valid: true, error: null }
  }

  _validateBySchema(model, options) {
    const schema = getBasicSchema(options)
    Object.assign(schema.properties, {
      type: { enum: ['number'] },
      default: { type: 'number' },
      minimum: { type: 'number' },
      maximum: { type: 'number' },
      exclusiveMaximum: { type: 'boolean' },
      exclusiveMinimum: { type: 'boolean' },
      multipleOf: { type: 'number', minimum: 0, exclusiveMinimum: true },
    })
    return tv4.validateResult(model, schema)
  }

  _validateExcusiveFields(model) {
    if (model.hasOwnProperty('minimum') && !model.hasOwnProperty('exclusiveMinimum')) {
      return {
        valid: false,
        error: { message: `Field "exclusiveMinimum" are required if field "minimum" are exist` },
      }
    }
    if (model.hasOwnProperty('maximum') && !model.hasOwnProperty('exclusiveMaximum')) {
      return {
        valid: false,
        error: { message: `Field "exclusiveMaximum" are required if field "maximum" are exist` },
      }
    }
    return { valid: true, error: null }
  }
}

module.exports = { NumberModelType }
