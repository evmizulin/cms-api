const { Client, ProjectPermission } = require('../services/db/Db')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { createPermissions } = require('./createPermissions')

class ApiPermissions {
  async getUserPermissions(projectId, userId) {
    const client = await Client.findOne({ type: 'user', clientSourceId: userId })
    const projectPermissions = await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { clientId: false, _id: false }
    )
    return {
      userId,
      ...projectPermissions,
    }
  }

  async updateUserPermissions(projectId, userId, permissions) {
    const { projectId: createdProjectId, userId: createdUserId, ...createdPermissions } = createPermissions({
      permissions,
    })
    if (projectId.toString() !== createdProjectId || userId.toString() !== createdUserId)
      throw new ApiError(BAD_REQUEST, 'ID in route must be equal to ID in body')
    const client = await Client.findOne({ type: 'user', clientSourceId: userId })
    const projectPermissions = await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { _id: true }
    )
    const { id, clientId, ...updatedPermissions } = await ProjectPermission.update(
      projectPermissions.id,
      createdPermissions
    )
    return {
      userId,
      ...updatedPermissions,
    }
  }
}

module.exports = { apiPermissions: new ApiPermissions() }
