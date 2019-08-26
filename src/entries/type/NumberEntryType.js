const tv4 = require('tv4')
const { getSchema } = require('./getSchema')
const { EntryType } = require('./EntryType')

class NumberEntryType extends EntryType {
  _validate(entry, options) {
    const schema = getSchema(
      {
        type: { enum: ['number'] },
        value: { type: 'number' },
      },
      options
    )
    return tv4.validateResult(entry, schema)
  }
}

module.exports = { NumberEntryType }
