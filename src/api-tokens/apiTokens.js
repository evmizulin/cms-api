// const { ApiToken } = require('../db/Db')
// const { isIdValid } = require('../../helpers/isIdValid')
const { BAD_REQUEST } = require('http-status-codes')
const { createApp } = require('./createApp')
const { ApiError } = require('../helpers/ApiError')
const { App, Client, AccessToken, ProjectPermission } = require('../services/db/Db')
const { generateToken } = require('../helpers/generateToken')
const { getDefaultProjectPermissions } = require('../helpers/getDefaultProjectPermissions')

class ApiTokens {
  async getApiTokens(projectId) {
    const projectPermissions = await ProjectPermission.find({ projectId }, { clientId: true })
    const clients = await Client.find(
      {
        $or: projectPermissions.map(item => ({ type: 'app', _id: item.clientId })),
      },
      { clientSourceId: true }
    )
    if (!clients.length) return []
    const apps = await App.find({ $or: clients.map(item => ({ _id: item.clientSourceId })) })
    const accessTokens = await AccessToken.find({ $or: clients.map(item => ({ clientId: item.id })) })
    return apps.map(app => ({
      ...app,
      token: accessTokens.find(
        accessToken =>
          accessToken.clientId.toString() ===
          clients.find(client => client.clientSourceId.toString() === app.id.toString()).id.toString()
      ).token,
    }))
  }

  async postApiToken(projectId, app) {
    const createdApp = createApp({ app, noId: true })
    const savedApp = await App.insert(createdApp)
    const client = await Client.findOne({ type: 'app', clientSourceId: savedApp.id }, { _id: true })
    await ProjectPermission.insert({
      projectId: projectId,
      clientId: client.id,
      ...getDefaultProjectPermissions('app'),
    })
    const accessToken = await AccessToken.insert({
      clientId: client.id,
      token: generateToken(),
    })
    return { ...savedApp, token: accessToken.token }
  }

  async putApiToken(appId, app) {
    const createdApp = createApp({ app, noId: false })
    if (appId.toString() !== createdApp.id)
      throw new ApiError(BAD_REQUEST, 'ID in route must be equal to ID in body')
    const updatedApp = await App.update(appId, createdApp)
    const client = await Client.findOne({ type: 'app', clientSourceId: appId })
    const accessToken = await AccessToken.findOne({ clientId: client.id })
    return { ...updatedApp, token: accessToken.token }
  }

  async deleteApiToken(projectId, appId) {
    const client = await Client.findOne({ type: 'app', clientSourceId: appId }, { _id: true })
    const accessToken = await AccessToken.findOne({ clientId: client.id }, { _id: true })
    const projectPermission = await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { _id: true }
    )
    await Promise.all([
      App.remove(appId),
      AccessToken.remove(accessToken.id),
      ProjectPermission.remove(projectPermission.id),
    ])
  }

  async getPermissions(projectId, appId) {
    const client = await Client.findOne({ type: 'app', clientSourceId: appId }, { _id: true })
    const projectPermissions = await ProjectPermission.findOne(
      { clientId: client.id, projectId },
      { clientId: false, _id: false }
    )
    return {
      appId,
      ...projectPermissions,
    }
  }
}

module.exports = { apiTokens: new ApiTokens() }
