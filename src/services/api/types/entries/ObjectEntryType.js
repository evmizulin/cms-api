const tv4 = require('tv4')
const { getSchema } = require('./getSchema')
const { EntryType } = require('./EntryType')

class ObjectEntryType extends EntryType {
  constructor(entry, options) {
    super(entry, options)
    const obj = options.isSub ? this.value : this.value.value
    Object.keys(obj).forEach(key => {
      obj[key] = options.createEntry(obj[key], { ...options, noId: true, isSub: true })
    })
  }

  _validate(entry, options) {
    const schema = getSchema(
      {
        type: { enum: ['object'] },
        value: { type: 'object' },
      },
      options
    )
    return tv4.validateResult(entry, schema)
  }
}

module.exports = { ObjectEntryType }
