// const { Model, Project, ProjectAndUserRelation } = require('../db/Db')
const { Project, ProjectImage, ProjectPermission } = require('../services/db/Db')
const { createProject } = require('./createProject')
const Trianglify = require('trianglify')
// const { apiTokens } = require('./ApiTokens')
// const { apiModels } = require('./ApiModels')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { getDefaultPermissions } = require('../helpers/getDefaultPermissions')

class ApiProjects {
  // async getProjects(userId) {
  //   const projectIds = await ProjectAndUserRelation.find({ userId }, 'projectId')
  //   if (!projectIds.length) {
  //     return []
  //   }
  //   return await Project.find({ $or: projectIds.map(item => ({ _id: item.projectId })) })
  // }

  async getProjects(clientId) {
    const projectIds = await ProjectPermission.find({ clientId, projectRead: true }, { projectId: true })
    if (!projectIds.length) return []
    return await Project.find({ $or: projectIds.map(item => ({ _id: item.projectId })) })
  }

  async getProjectImage(projectId) {
    const image = await ProjectImage.findOne({ projectId: projectId })
    return image
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
  async postProject(clientId, project) {
    const createdProject = createProject({ project, noId: true })
    const savedProject = await Project.insert(createdProject)
    await ProjectPermission.insert({
      projectId: savedProject.id,
      clientId: clientId,
      ...getDefaultPermissions('user'),
    })
    const png = Trianglify({
      width: 600,
      height: 600,
      cell_size: 40,
      variance: '0.6',
    }).png()
    await ProjectImage.insert({
      buffer: new Buffer(png.substr(png.indexOf('base64') + 7), 'base64'),
      projectId: savedProject.id,
    })
    return savedProject
  }

  // async putProject(projectId, project) {
  //   const createdProject = createProject(project, { noId: false })
  //   await Project.update(projectId, createdProject)
  // }
  async putProject(projectId, project) {
    const createdProject = createProject({ project })
    if (projectId.toString() !== createdProject.id)
      throw new ApiError(BAD_REQUEST, 'ID in route must be equal to ID in body')
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

  async deleteProject(projectId) {
    const projectImage = await ProjectImage.findOne({ projectId }, { _id: true })
    const projectPermissions = await ProjectPermission.find({ projectId }, { _id: true })
    await ProjectImage.remove(projectImage.id)
    await Promise.all(projectPermissions.map(item => ProjectPermission.remove(item.id)))
    await Project.remove(projectId)
  }
}

module.exports = { apiProjects: new ApiProjects() }
