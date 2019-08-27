const tv4 = require('tv4')
const { getSchema } = require('./getSchema')
const { EntryType } = require('./EntryType')

class ReferenceEntryType extends EntryType {
  _validate(entry, options) {
    const { valid, error } = this._validateBySchema(entry, options)
    if (!valid) return { valid, error }

    const { valid: validR, error: errorR } = this._validateReference(entry, options)
    if (!validR) return { valid: validR, error: errorR }

    return { valid: true, error: null }
  }

  _validateBySchema(entry, options) {
    const schema = getSchema(
      {
        type: { enum: ['reference'] },
        value: { type: 'string', minLength: 1 },
      },
      options
    )
    return tv4.validateResult(entry, schema)
  }

  _validateReference(entry, { entries, isSub }) {
    const value = isSub ? entry.value : entry.value.value
    const valid = entries.some(item => item.id.toString() === value)
    return { valid, error: valid ? null : { message: 'Unvalid reference' } }
  }
}

module.exports = { ReferenceEntryType }
