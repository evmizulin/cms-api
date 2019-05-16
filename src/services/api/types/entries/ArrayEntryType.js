const tv4 = require('tv4')
const { getSchema } = require('./getSchema')
const { EntryType } = require('./EntryType')

class ArrayEntryType extends EntryType {
  constructor(entry, options) {
    super(entry, options)
    const arr = options.isSub ? this.value : this.value.value
    arr.forEach((item, i) => {
      arr[i] = options.createEntry(item, { ...options, noId: true, isSub: true })
    })
  }

  _validate(entry, options) {
    const schema = getSchema(
      {
        type: { enum: ['array'] },
        value: { type: 'array' },
      },
      options
    )
    return tv4.validateResult(entry, schema)
  }
}

module.exports = { ArrayEntryType }
