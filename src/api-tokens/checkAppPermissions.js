const { ApiError } = require('../helpers/ApiError')
const { ProjectPermission, App, Client } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')

const checkAppPermissions = async (req, res, next) => {
  const { projectId, appId } = req.extractedProps

  const app = await App.findById(appId, { _id: true })
  const client = await Client.findOne({ type: 'app', clientSourceId: app.id }, { _id: true })
  const projectPermission = await ProjectPermission.findOne({ clientId: client.id, projectId })

  if (!projectPermission) throw new ApiError(NOT_FOUND, 'ApiToken not found')

  next()
}

module.exports = { checkAppPermissions }
