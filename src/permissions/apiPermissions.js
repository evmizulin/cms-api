const { Client, ProjectPermission } = require('../services/db/Db')
const { createPermissions } = require('./createPermissions')

class ApiPermissions {
  async getUserPermissions(projectId, userId) {
    const client = await Client.findOne({ type: 'user', clientSourceId: userId })
    return await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { clientId: false, _id: false, projectId: false }
    )
  }

  async updateUserPermissions(projectId, userId, permissions) {
    const createdPermissions = createPermissions({ permissions })
    const client = await Client.findOne({ type: 'user', clientSourceId: userId })
    const projectPermissions = await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { _id: true }
    )
    const { id, clientId, projectId: pI, ...updatedPermissions } = await ProjectPermission.update(
      projectPermissions.id,
      createdPermissions
    )
    return updatedPermissions
  }

  async getApiTokenPermissions(projectId, appId) {
    const client = await Client.findOne({ type: 'app', clientSourceId: appId }, { _id: true })
    return await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { clientId: false, _id: false, projectId: false }
    )
  }

  async updateApiTokenPermissions(projectId, appId, permissions) {
    const createdPermissions = createPermissions({ permissions })
    const client = await Client.findOne({ type: 'app', clientSourceId: appId })
    const projectPermissions = await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { _id: true }
    )
    const { id, clientId, projectId: pI, ...updatedPermissions } = await ProjectPermission.update(
      projectPermissions.id,
      createdPermissions
    )
    return updatedPermissions
  }
}

module.exports = { apiPermissions: new ApiPermissions() }
