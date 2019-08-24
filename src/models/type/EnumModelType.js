const uniq = require('lodash.uniq')
const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class EnumModelType extends ModelType {
  _validate(model, options) {
    const { valid, error } = this._validateBySchema(model, options)
    if (!valid) return { valid, error }

    const { valid: validU, error: errorU } = this._validateUniqueness(model)
    if (!validU) return { valid: validU, error: errorU }

    const { valid: validD, error: errorD } = this._validateDefault(model)
    if (!validD) return { valid: validD, error: errorD }

    return { valid: true, error: null }
  }

  _validateBySchema(model, options) {
    const schema = getBasicSchema(options)
    schema.required.push('enum')
    Object.assign(schema.properties, {
      type: { enum: ['enum'] },
      default: {
        anyOf: [{ type: 'boolean' }, { type: 'string' }, { type: 'number' }],
      },
      enum: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['label', 'value'],
          properties: {
            label: { type: 'string', minLength: 1 },
            value: {
              anyOf: [{ type: 'boolean' }, { type: 'string' }, { type: 'number' }],
            },
          },
        },
      },
    })
    return tv4.validateResult(model, schema)
  }

  _validateUniqueness(model) {
    const enumValues = model.enum.map(item => item.value)
    const valid = uniq(enumValues).length === enumValues.length
    return {
      valid,
      error: valid ? null : { message: 'All values in enum must be unique' },
    }
  }

  _validateDefault(model) {
    const valid = !model.hasOwnProperty('default')
      ? true
      : model.enum.some(item => item.value === model.default)
    return {
      valid,
      errors: valid ? null : { message: 'Default value must be one of enum values' },
    }
  }
}

module.exports = { EnumModelType }
