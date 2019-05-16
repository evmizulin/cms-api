const { BooleanModelType } = require('./BooleanModelType')
const { ReferenceModelType } = require('./ReferenceModelType')
const { ObjectModelType } = require('./ObjectModelType')
const { NumberModelType } = require('./NumberModelType')
const { StringModelType } = require('./StringModelType')
const { AssetModelType } = require('./AssetModelType')
const { ArrayModelType } = require('./ArrayModelType')
const { EnumModelType } = require('./EnumModelType')
const { BAD_REQUEST } = require('http-status-codes')
const { ApiError } = require('../../../../helpers/ApiError')

const createModel = (model, options) => {
  const map = {
    'string-line': StringModelType,
    'string-html': StringModelType,
    'string-markdown': StringModelType,
    'string-multiline': StringModelType,
    number: NumberModelType,
    boolean: BooleanModelType,
    object: ObjectModelType,
    array: ArrayModelType,
    enum: EnumModelType,
    reference: ReferenceModelType,
    asset: AssetModelType,
  }

  if (!model || !model.type || !map[model.type]) {
    throw new ApiError('Unvalid model type', BAD_REQUEST)
  }

  return new map[model.type](model, options)
}

module.exports = { createModel }
