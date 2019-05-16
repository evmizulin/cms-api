const { Model, File, Entry } = require('../db/Db')
const { createEntry } = require('./types/entries/createEntry')
const { ApiError } = require('../../helpers/ApiError')
const { isIdValid } = require('../../helpers/isIdValid')
const { NOT_FOUND, BAD_REQUEST } = require('http-status-codes')
const { isEntryConsistent } = require('./helpers/isEntryConsistent')
const { isEntryMatchModel } = require('./helpers/isEntryMatchModel')
const { isEntryRefConflict } = require('./helpers/isEntryRefConflict')
const { getFileIdsForDeleting } = require('./helpers/getFileIdsForDeleting')

class ApiEntries {
  async postEntry(projectId, entry) {
    const modelIds = await Model.find({ projectId }, '_id')
    const entryIdsAndModelIds = await Entry.find({ projectId }, '_id modelId')
    const fileIdsAndNames = await File.find({ projectId }, '_id name')
    const createdEnrty = createEntry(entry, {
      noId: true,
      isSub: false,
      createEntry,
      models: modelIds,
      entries: entryIdsAndModelIds,
      files: fileIdsAndNames,
    })
    const model = await Model.findById(createdEnrty.modelId, '-projectId')
    const isConsistent = isEntryConsistent(model, createdEnrty)
    if (!isConsistent) throw new ApiError('Inconsistent entry', BAD_REQUEST)
    const { valid, error } = isEntryMatchModel(model, createdEnrty)
    if (!valid) throw new ApiError(error.message, BAD_REQUEST)
    const isRefConflict = isEntryRefConflict(model, createdEnrty, entryIdsAndModelIds)
    if (isRefConflict) throw new ApiError('Entry has unvalid reference', BAD_REQUEST)
    await Entry.save({ projectId, ...createdEnrty })
  }

  async putEntry(projectId, entryId, entry) {
    const idValid = isIdValid(entryId)
    if (!idValid) throw new ApiError('Unvalid entryId', NOT_FOUND)
    const entity = await Entry.findById(entryId)
    if (!entity || entity.projectId !== projectId) throw new ApiError('Entry not found', NOT_FOUND)

    const modelIds = await Model.find({ projectId }, '_id')
    const entryIdsAndModelIds = await Entry.find({ projectId }, '_id modelId')
    const fileIdsAndNames = await File.find({ projectId }, '_id name')
    const createdEnrty = createEntry(entry, {
      noId: false,
      isSub: false,
      createEntry,
      models: modelIds,
      entries: entryIdsAndModelIds,
      files: fileIdsAndNames,
    })
    const model = await Model.findById(createdEnrty.modelId)
    const isConsistent = isEntryConsistent(model, createdEnrty)
    if (!isConsistent) throw new ApiError('Inconsistent entry', BAD_REQUEST)
    const { valid, error } = isEntryMatchModel(model, createdEnrty)
    if (!valid) throw new ApiError(error.message, BAD_REQUEST)
    const isRefConflict = isEntryRefConflict(model, createdEnrty, entryIdsAndModelIds)
    if (isRefConflict) throw new ApiError('Entry has unvalid reference', BAD_REQUEST)
    const filesIds = getFileIdsForDeleting(entity, createdEnrty)
    await Entry.update(entryId, { projectId, ...createdEnrty })
    await Promise.all(filesIds.map(id => File.findByIdAndRemove(id)))
  }

  async deleteEntry(projectId, entryId) {
    const idValid = isIdValid(entryId)
    if (!idValid) throw new ApiError('Unvalid entryId', NOT_FOUND)
    const entity = await Entry.findById(entryId)
    if (!entity || entity.projectId !== projectId) throw new ApiError('Entry not found', NOT_FOUND)

    const filesIds = getFileIdsForDeleting(entity)
    await Entry.remove(entryId)
    await Promise.all(filesIds.map(id => File.findByIdAndRemove(id)))
  }

  async getEntries(projectId, apiId) {
    if (apiId) {
      const models = await Model.find({ projectId, apiId }, '_id')
      const query = models.map(item => ({ projectId, modelId: item.id }))
      if (!query.length) return []
      return await Entry.find({ $or: query }, '-projectId')
    }
    return await Entry.find({ projectId }, '-projectId')
  }

  async getEntry(projectId, entryId) {
    const idValid = isIdValid(entryId)
    if (!idValid) throw new ApiError('Unvalid entryId', NOT_FOUND)
    const entity = await Entry.findById(entryId, '_id projectId')
    if (!entity || entity.projectId !== projectId) throw new ApiError('Entry not found', NOT_FOUND)

    return await Entry.findById(entryId, '-projectId')
  }
}

module.exports = { apiEntries: new ApiEntries() }
