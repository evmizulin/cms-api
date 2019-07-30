const { ApiError } = require('../helpers/ApiError')
const { File } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')

const checkFilePermission = async (req, res, next) => {
  const { projectId, fileId } = req.extractedProps

  const file = await File.findOne({ _id: fileId, projectId }, { _id: true })

  if (!file) throw new ApiError(NOT_FOUND, 'File not found')

  next()
}

module.exports = { checkFilePermission }
