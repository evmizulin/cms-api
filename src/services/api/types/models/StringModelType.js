const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class StringModelType extends ModelType {
  _validate(model, options) {
    const { valid, error } = this._validateBySchema(model, options)
    if (!valid) return { valid, error }

    const { valid: validP, error: errorP } = this._validatePattern(model)
    if (!validP) return { valid: validP, error: errorP }

    return { valid: true, error: null }
  }

  _validateBySchema(model, options) {
    const schema = getBasicSchema(options)
    Object.assign(schema.properties, {
      type: { enum: ['string-line', 'string-multiline', 'string-html', 'string-markdown'] },
      default: { type: 'string', minLength: 1 },
      minLength: { type: 'integer', minimum: 0 },
      maxLength: { type: 'integer', minimum: 0 },
      pattern: { type: 'string', minLength: 1 },
    })
    return tv4.validateResult(model, schema)
  }

  _validatePattern(model) {
    if (model.pattern) {
      try {
        RegExp(model.pattern)
      } catch (error) {
        return { valid: false, error: { message: error.message } }
      }
    }
    return { valid: true, error: null }
  }
}

module.exports = { StringModelType }
