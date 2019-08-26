const { Model } = require('../services/db/Db')
const { createModel } = require('./type/createModel')
const { BAD_REQUEST } = require('http-status-codes')
const { ApiError } = require('../helpers/ApiError')

class ApiModels {
  async getModels(projectId) {
    return await Model.find({ projectId }, { projectId: false })
  }

  async getModel(projectId, modelId) {
    return await Model.findById(modelId, { projectId: false })
  }

  async postModel(projectId, model) {
    const models = await Model.find({ projectId }, { _id: true })
    const createdModel = createModel(model, { noId: true, noApiId: false, models, createModel })
    const { projectId: pI, ...savedModel } = await Model.insert({ projectId, ...createdModel })
    return savedModel
  }

  async putModel(projectId, modelId, model) {
    const models = await Model.find({ projectId }, { _id: true })
    const createdModel = createModel(model, { noId: false, noApiId: false, models, createModel })
    if (modelId.toString() !== model.id)
      throw new ApiError(BAD_REQUEST, 'ID in route must be equal to ID in body')
    const { projectId: pI, ...savedModel } = await Model.update(modelId, { projectId, ...createdModel })
    return savedModel
  }

  async deleteModel(projectId, modelId) {
    // const entries = await Entry.find({ projectId, modelId }, '_id')
    // await Promise.all(entries.map(entry => apiEntries.deleteEntry(projectId, entry.id)))
    await Model.remove(modelId)
  }
}

module.exports = { apiModels: new ApiModels() }
