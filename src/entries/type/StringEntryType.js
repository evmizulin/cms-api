const tv4 = require('tv4')
const { getSchema } = require('./getSchema')
const { EntryType } = require('./EntryType')

class StringEntryType extends EntryType {
  _validate(entry, options) {
    const schema = getSchema(
      {
        type: { enum: ['string-line', 'string-multiline', 'string-html', 'string-markdown'] },
        value: { type: 'string' },
      },
      options
    )
    return tv4.validateResult(entry, schema)
  }
}

module.exports = { StringEntryType }
