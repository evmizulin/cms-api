const tv4 = require('tv4')
const { getBasicSchema } = require('./getBasicSchema')
const { ModelType } = require('./ModelType')

class AssetModelType extends ModelType {
  _validate(model, options) {
    const schema = getBasicSchema(options)
    Object.assign(schema.properties, {
      type: { enum: ['asset'] },
    })
    return tv4.validateResult(model, schema)
  }
}

module.exports = { AssetModelType }
