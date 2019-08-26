const { ApiError } = require('../helpers/ApiError')
const { Entry } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')
const { isIdValid } = require('../helpers/isIdValid')

const extractEntryId = async (req, res, next) => {
  const { entryId } = req.params

  if (!isIdValid(entryId)) throw new ApiError(NOT_FOUND, 'EntryId is not valid')
  const foundedEntry = await Entry.findById(entryId, { _id: true })
  if (!foundedEntry) throw new ApiError(NOT_FOUND, 'Entry not found')

  req.extractedProps = { ...(req.extractedProps || {}), entryId: foundedEntry.id }

  next()
}

module.exports = { extractEntryId }
