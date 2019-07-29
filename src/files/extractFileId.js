const { ApiError } = require('../helpers/ApiError')
const { File } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')
const { isIdValid } = require('../helpers/isIdValid')

const extractFileId = async (req, res, next) => {
  const { fileId, fileName } = req.params

  if (!isIdValid(fileId)) throw new ApiError(NOT_FOUND, 'FileId is not valid')
  const foundedFile = await File.findOne({ _id: fileId, name: fileName }, { _id: true })
  if (!foundedFile) throw new ApiError(NOT_FOUND, 'File not found')

  req.extractedProps = { ...(req.extractedProps || {}), fileId: foundedFile.id, fileName }

  next()
}

module.exports = { extractFileId }
