const { Model } = require('../services/db/Db')
const { createModel } = require('./type/createModel')

class ApiModels {
  async getModels(projectId) {
    return await Model.find({ projectId }, { projectId: false })
  }

  async postModel(projectId, model) {
    const models = await Model.find({ projectId }, { _id: true })
    const createdModel = createModel(model, { noId: true, noApiId: false, models, createModel })
    await Model.imsert({ projectId, ...createdModel })
  }

  async putModel(projectId, modelId, model) {
    // should be a check projectId === model.projectId or no?
    const models = await Model.find({ projectId }, { _id: true })
    const createdModel = createModel(model, { noId: false, noApiId: false, models, createModel })
    await Model.update(modelId, { projectId, ...createdModel })
  }

  async deleteModel(projectId, modelId) {
    // const entries = await Entry.find({ projectId, modelId }, '_id')
    // await Promise.all(entries.map(entry => apiEntries.deleteEntry(projectId, entry.id)))
    await Model.remove(modelId)
  }
}

module.exports = { apiModels: new ApiModels() }
