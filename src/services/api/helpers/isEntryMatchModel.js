const tv4 = require('tv4')
const { entryToValue } = require('./entryToValue')
const { modelToSchema } = require('./modelToSchema')

const isEntryMatchModel = (model, entry) => {
  return tv4.validateResult(entryToValue(entry), modelToSchema(model))
}

module.exports = { isEntryMatchModel }
