const { ApiError } = require('../helpers/ApiError')
const { Entry } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')

const checkEntryPermissions = async (req, res, next) => {
  const { projectId, entryId } = req.extractedProps

  const entry = await Entry.findOne({ _id: entryId, projectId }, { _id: true })

  if (!entry) throw new ApiError(NOT_FOUND, 'Entry not found')

  next()
}

module.exports = { checkEntryPermissions }
