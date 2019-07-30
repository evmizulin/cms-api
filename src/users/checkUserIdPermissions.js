const { ApiError } = require('../helpers/ApiError')
const { ProjectPermission, Client } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')

const checkUserIdPermissions = async (req, res, next) => {
  const { projectId, userId } = req.extractedProps

  const client = await Client.findOne({ type: 'user', clientSourceId: userId }, { _id: true })
  const projectPermission = await ProjectPermission.findOne({ clientId: client.id, projectId })

  if (!projectPermission) throw new ApiError(NOT_FOUND, 'User is not found')

  next()
}

module.exports = { checkUserIdPermissions }
