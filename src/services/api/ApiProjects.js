// const { Model, Project, ProjectAndUserRelation } = require('../db/Db')
const { Project } = require('../db/Db')
const { createProject } = require('./types/projects/createProject')
const Trianglify = require('trianglify')
// const { apiTokens } = require('./ApiTokens')
// const { apiModels } = require('./ApiModels')
const { ApiError } = require('../../helpers/ApiError')
const { BAD_REQUEST, NOT_FOUND } = require('http-status-codes')

class ApiProjects {
  // async getProjects(userId) {
  //   const projectIds = await ProjectAndUserRelation.find({ userId }, 'projectId')
  //   if (!projectIds.length) {
  //     return []
  //   }
  //   return await Project.find({ $or: projectIds.map(item => ({ _id: item.projectId })) })
  // }

  async getProjects() {
    return await Project.find()
  }

  // async postProject(userId, project) {
  //   const createdProject = createProject(project, { noId: true })
  //   const savedProject = await Project.save({
  //     ...createdProject,
  //     image: Trianglify({
  //       width: 600,
  //       height: 600,
  //       cell_size: 40,
  //       variance: '0.6',
  //     }).png(),
  //   })
  //   await ProjectAndUserRelation.save({ projectId: savedProject.id, userId })
  // }
  async postProject(project) {
    const createdProject = createProject({ project, noId: true })
    return await Project.insert({
      ...createdProject,
      image: Trianglify({
        width: 600,
        height: 600,
        cell_size: 40,
        variance: '0.6',
      }).png(),
    })
  }

  // async putProject(projectId, project) {
  //   const createdProject = createProject(project, { noId: false })
  //   await Project.update(projectId, createdProject)
  // }
  async putProject(projectId, project) {
    const createdProject = createProject({ project })
    if (projectId !== createdProject.id)
      throw new ApiError(BAD_REQUEST, 'ID in route must be equal to ID in body')
    const foundedProject = await Project.findById(projectId, { _id: true })
    if (!foundedProject) throw new ApiError(NOT_FOUND)
    return await Project.update(projectId, createdProject)
  }
  //
  // async deleteProject(projectId) {
  //   const models = await Model.find({ projectId }, '_id')
  //   await Promise.all(models.map(model => apiModels.deleteModel(projectId, model.id)))
  //   const tokens = await apiTokens.getApiTokens(projectId)
  //   await Promise.all(tokens.map(item => apiTokens.deleteApiToken(projectId, item.id)))
  //   const relations = await ProjectAndUserRelation.find({ projectId }, '_id')
  //   await Promise.all(relations.map(relation => ProjectAndUserRelation.findByIdAndRemove(relation.id)))
  //   await Project.remove(projectId)
  // }
}

module.exports = { apiProjects: new ApiProjects() }
