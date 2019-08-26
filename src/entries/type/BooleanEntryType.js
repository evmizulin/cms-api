const tv4 = require('tv4')
const { getSchema } = require('./getSchema')
const { EntryType } = require('./EntryType')

class BooleanEntryType extends EntryType {
  _validate(entry, options) {
    const schema = getSchema(
      {
        type: { enum: ['boolean'] },
        value: { type: 'boolean' },
      },
      options
    )
    return tv4.validateResult(entry, schema)
  }
}

module.exports = { BooleanEntryType }
