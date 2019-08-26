const { NumberEntryType } = require('./NumberEntryType')
const { StringEntryType } = require('./StringEntryType')
const { BooleanEntryType } = require('./BooleanEntryType')
const { ObjectEntryType } = require('./ObjectEntryType')
const { ArrayEntryType } = require('./ArrayEntryType')
const { EnumEntryType } = require('./EnumEntryType')
const { ReferenceEntryType } = require('./ReferenceEntryType')
const { AssetEntryType } = require('./AssetEntryType')
const { BAD_REQUEST } = require('http-status-codes')
const { ApiError } = require('../../helpers/ApiError')

const createEntry = (entry, options) => {
  const map = {
    'string-line': StringEntryType,
    'string-html': StringEntryType,
    'string-markdown': StringEntryType,
    'string-multiline': StringEntryType,
    number: NumberEntryType,
    boolean: BooleanEntryType,
    object: ObjectEntryType,
    array: ArrayEntryType,
    enum: EnumEntryType,
    reference: ReferenceEntryType,
    asset: AssetEntryType,
  }

  const isEntry = entry && entry.value && entry.value.type && map[entry.value.type]
  const isSubEntry = entry && entry.type && map[entry.type]

  if (!isEntry && !isSubEntry) {
    throw new ApiError(BAD_REQUEST, 'Unvalid entry type')
  }

  return new map[isEntry ? entry.value.type : entry.type](entry, options)
}

module.exports = { createEntry }
