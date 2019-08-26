const { ApiError } = require('../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')

// abstract class
class EntryType {
  constructor(entry, options) {
    this._getOptions = () => options

    const { valid, error } = this._validate(entry, options)
    if (!valid) {
      throw new ApiError(BAD_REQUEST, error.message)
    }

    if (!options.isSub) {
      const { valid: idValid, error: idError } = this._validateModelId(entry, options)
      if (!idValid) {
        throw new ApiError(BAD_REQUEST, idError.message)
      }
    }

    Object.keys(entry).forEach(key => {
      this[key] = entry[key]
    })
  }

  _validate() {
    throw new Error('method _validate must be implemented')
  }

  _validateModelId(entry, { models }) {
    const valid = models.some(model => model.id === entry.modelId)
    return { valid, error: valid ? null : { message: 'Unvalid modelId' } }
  }
}

module.exports = { EntryType }
