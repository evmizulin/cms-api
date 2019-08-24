const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class ReferenceModelType extends ModelType {
  _validate(model, options) {
    const { valid, error } = this._validateBySchema(model, options)
    if (!valid) return { valid, error }

    const { valid: validR, error: errorR } = this._validateReference(model, options.models)
    if (!validR) return { valid: validR, error: errorR }

    return { valid: true, error: null }
  }

  _validateBySchema(model, options) {
    const schema = getBasicSchema(options)
    schema.required.push('reference')
    Object.assign(schema.properties, {
      type: { enum: ['reference'] },
      reference: { type: 'string', minLength: 1 },
    })
    return tv4.validateResult(model, schema)
  }

  _validateReference(model, models) {
    const valid = models.some(item => item.id === model.reference)
    return { valid, error: valid ? null : { message: 'Unvalid reference' } }
  }
}

module.exports = { ReferenceModelType }
