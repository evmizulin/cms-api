const { ApiError } = require('../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')

// abstract class
class ModelType {
  constructor(model, options) {
    this._createModel = options.createModel
    const { valid, error } = this._validate(model, options)
    if (!valid) {
      throw new ApiError(BAD_REQUEST, error.message)
    }
    Object.keys(model).forEach(key => {
      this[key] = model[key]
    })
  }

  _validate() {
    throw new Error('method _validate must be implemented')
  }
}

module.exports = { ModelType }
