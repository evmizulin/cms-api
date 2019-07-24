const { User, Client, ProjectPermission } = require('../services/db/Db')
const { createUser } = require('./createUser')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { getDefaultProjectPermissions } = require('../helpers/getDefaultProjectPermissions')

class ApiUsers {
  async search(login) {
    if (!login) return []
    const users = await User.find({ isVerified: true }, { login: true })
    return users.filter(user => user.login.toLowerCase().indexOf(login.toLowerCase()) > -1).slice(0, 4)
  }

  async addUserToProject(projectId, user) {
    const createdUser = createUser({ user })
    const foundedUser = await User.findOne(
      { _id: createdUser.id, login: createdUser.login, isVerified: true },
      { _id: true }
    )
    if (!foundedUser) throw new ApiError(BAD_REQUEST, 'User not found')
    const client = await Client.findOne({ type: 'user', clientSourceId: foundedUser.id }, { _id: true })
    const projectPermission = await ProjectPermission.findOne(
      {
        projectId: projectId,
        clientId: client.id,
      },
      { _id: true }
    )
    if (projectPermission) throw new ApiError(BAD_REQUEST, 'User already in project')
    await ProjectPermission.insert({
      projectId: projectId,
      clientId: client.id,
      ...getDefaultProjectPermissions('user'),
    })
    return createdUser
  }

  async getUsersOfProject(projectId) {
    const projectPermissions = await ProjectPermission.find({ projectId }, { clientId: true })
    const clients = await Client.find(
      {
        $or: projectPermissions.map(item => ({ type: 'user', _id: item.clientId })),
      },
      { clientSourceId: true }
    )
    if (!clients.length) return []
    return await User.find({ $or: clients.map(item => ({ _id: item.clientSourceId })) }, { login: true })
  }

  async deleteUserOfProject(projectId, userId) {
    const client = await Client.findOne({ type: 'user', clientSourceId: userId })
    const projectPermissions = await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { _id: true }
    )
    await ProjectPermission.remove(projectPermissions.id)
  }

  async getPermissions(projectId, userId) {
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
}

module.exports = { apiUsers: new ApiUsers() }
