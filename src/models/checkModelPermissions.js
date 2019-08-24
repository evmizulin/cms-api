const { ApiError } = require('../helpers/ApiError')
const { Model } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')

const checkModelPermissions = async (req, res, next) => {
  const { projectId, modelId } = req.extractedProps

  const model = await Model.findOne({ _id: modelId, projectId }, { _id: true })

  if (!model) throw new ApiError(NOT_FOUND, 'Model not found')

  next()
}

module.exports = { checkModelPermissions }
