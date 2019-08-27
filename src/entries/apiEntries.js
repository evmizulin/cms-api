const { Model, File, Entry } = require('../services/db/Db')
const { createEntry } = require('./type/createEntry')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { isEntryConsistent } = require('./helpers/isEntryConsistent')
const { isEntryMatchModel } = require('./helpers/isEntryMatchModel')
const { isEntryRefConflict } = require('./helpers/isEntryRefConflict')
const { getFileIdsForDeleting } = require('./helpers/getFileIdsForDeleting')

class ApiEntries {
  async postEntry(projectId, entry) {
    const modelIds = await Model.find({ projectId }, { _id: true })
    const entryIds = await Entry.find({ projectId }, { _id: true, modelId: true })
    const fileIds = await File.find({ projectId }, { _id: true, name: true })
    const createdEnrty = createEntry(entry, {
      noId: true,
      isSub: false,
      createEntry,
      models: modelIds,
      entries: entryIds,
      files: fileIds,
    })
    const model = await Model.findById(createdEnrty.modelId, { projectId: false })
    const isConsistent = isEntryConsistent(model, createdEnrty)
    if (!isConsistent) throw new ApiError(BAD_REQUEST, 'Inconsistent entry')
    const { valid, error } = isEntryMatchModel(model, createdEnrty)
    if (!valid) throw new ApiError(BAD_REQUEST, error.message)
    const isRefConflict = isEntryRefConflict(model, createdEnrty, entryIds)
    if (isRefConflict) throw new ApiError(BAD_REQUEST, 'Entry has unvalid reference')
    const { projectId: pI, ...savedEntry } = await Entry.insert({
      projectId,
      ...createdEnrty,
      modelId: model.id,
    })
    return savedEntry
  }

  async getEntries(projectId, apiId) {
    if (apiId) {
      const models = await Model.find({ projectId, apiId }, { _id: true })
      const query = models.map(item => ({ projectId, modelId: item.id }))
      if (!query.length) return []
      return await Entry.find({ $or: query }, { projectId: false })
    }
    return await Entry.find({ projectId }, { projectId: false })
  }

  async getEntry(projectId, entryId) {
    return await Entry.findById(entryId, { projectId: false })
  }

  async putEntry(projectId, entryId, entry) {
    const modelIds = await Model.find({ projectId }, { _id: true })
    const entryIds = await Entry.find({ projectId }, { _id: true, modelId: true })
    const fileIds = await File.find({ projectId }, { _id: true, name: true })
    const createdEnrty = createEntry(entry, {
      noId: false,
      isSub: false,
      createEntry,
      models: modelIds,
      entries: entryIds,
      files: fileIds,
    })
    if (entryId.toString() !== createdEnrty.id)
      throw new ApiError(BAD_REQUEST, 'ID in route must be equal to ID in body')
    const oldEntry = await Entry.findById(entryId)
    const model = await Model.findById(createdEnrty.modelId)
    const isConsistent = isEntryConsistent(model, createdEnrty)
    if (!isConsistent) throw new ApiError(BAD_REQUEST, 'Inconsistent entry')
    const { valid, error } = isEntryMatchModel(model, createdEnrty)
    if (!valid) throw new ApiError(BAD_REQUEST, error.message)
    const isRefConflict = isEntryRefConflict(model, createdEnrty, entryIds)
    if (isRefConflict) throw new ApiError(BAD_REQUEST, 'Entry has unvalid reference')
    const filesIds = getFileIdsForDeleting(oldEntry, createdEnrty)
    await Entry.update(entryId, { projectId, ...createdEnrty })
    await Promise.all(filesIds.map(id => File.remove(id)))
  }

  async deleteEntry(projectId, entryId) {
    const entry = await Entry.findById(entryId)
    const filesIds = getFileIdsForDeleting(entry)
    await Entry.remove(entryId)
    await Promise.all(filesIds.map(id => File.remove(id)))
  }
}

module.exports = { apiEntries: new ApiEntries() }
