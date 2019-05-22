const { Model, Project, ProjectAndUserRelation } = require('../db/Db')
const { createProject } = require('./types/projects/createProject')
const Trianglify = require('trianglify')
const { apiTokens } = require('./ApiTokens')
const { apiModels } = require('./ApiModels')

class ApiProjects {
  async getProjects(userId) {
    const projectIds = await ProjectAndUserRelation.find({ userId }, 'projectId')
    if (!projectIds.length) {
      return []
    }
    return await Project.find({ $or: projectIds.map(item => ({ _id: item.projectId })) })
  }

  async postProject(userId, project) {
    const createdProject = createProject(project, { noId: true })
    const savedProject = await Project.save({
      ...createdProject,
      image: Trianglify({
        width: 600,
        height: 600,
        cell_size: 40,
        variance: '0.6',
      }).png(),
    })
    await ProjectAndUserRelation.save({ projectId: savedProject.id, userId })
  }

  async putProject(projectId, project) {
    const createdProject = createProject(project, { noId: false })
    await Project.update(projectId, createdProject)
  }

  async deleteProject(projectId) {
    const models = await Model.find({ projectId }, '_id')
    await Promise.all(models.map(model => apiModels.deleteModel(projectId, model.id)))
    const tokens = await apiTokens.getApiTokens(projectId)
    await Promise.all(tokens.map(item => apiTokens.deleteApiToken(projectId, item.id)))
    const relations = await ProjectAndUserRelation.find({ projectId }, '_id')
    await Promise.all(relations.map(relation => ProjectAndUserRelation.findByIdAndRemove(relation.id)))
    await Project.remove(projectId)
  }
}

module.exports = { apiProjects: new ApiProjects() }
