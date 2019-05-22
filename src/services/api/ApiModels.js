const { Model, Entry } = require('../db/Db')
const { createModel } = require('./types/models/createModel')
const { ApiError } = require('../../helpers/ApiError')
const { isIdValid } = require('../../helpers/isIdValid')
const { NOT_FOUND } = require('http-status-codes')
const { apiEntries } = require('./ApiEntries')

class ApiModels {
  async getModels(projectId) {
    return await Model.find({ projectId }, '-projectId')
  }

  async postModel(projectId, model) {
    const models = await Model.find({ projectId }, '_id')
    const createdModel = createModel(model, { noId: true, noApiId: false, models, createModel })
    await Model.save({ projectId, ...createdModel })
  }

  async putModel(projectId, modelId, model) {
    const idValid = isIdValid(modelId)
    if (!idValid) throw new ApiError('Unvalid modelId', NOT_FOUND)
    const entity = await Model.findById(modelId, '_id projectId')
    if (!entity || entity.projectId !== projectId) throw new ApiError('Model not found', NOT_FOUND)

    const models = await Model.find({ projectId }, '_id')
    const createdModel = createModel(model, { noId: false, noApiId: false, models, createModel })
    await Model.update(modelId, { projectId, ...createdModel })
  }

  async deleteModel(projectId, modelId) {
    const idValid = isIdValid(modelId)
    if (!idValid) throw new ApiError('Unvalid modelId', NOT_FOUND)
    const entity = await Model.findById(modelId, '_id projectId')
    if (!entity || entity.projectId !== projectId) throw new ApiError('Model not found', NOT_FOUND)

    const entries = await Entry.find({ projectId, modelId }, '_id')
    await Promise.all(entries.map(entry => apiEntries.deleteEntry(projectId, entry.id)))
    await Model.remove(modelId)
  }
}

module.exports = { apiModels: new ApiModels() }
