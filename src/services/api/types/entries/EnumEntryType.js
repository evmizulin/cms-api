const tv4 = require('tv4')
const { getSchema } = require('./getSchema')
const { EntryType } = require('./EntryType')

class EnumEntryType extends EntryType {
  _validate(entry, options) {
    const schema = getSchema(
      {
        type: { enum: ['enum'] },
        value: {
          anyOf: [{ type: 'boolean' }, { type: 'string' }, { type: 'number' }],
        },
      },
      options
    )
    return tv4.validateResult(entry, schema)
  }
}

module.exports = { EnumEntryType }
