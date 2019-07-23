const { ApiError } = require('../helpers/ApiError')
const { ProjectPermission, User, Client } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')

const checkUserIdPermissions = async (req, res, next) => {
  const { projectId, userId } = req.extractedProps

  const user = await User.findById(userId, { _id: true })
  const client = await Client.findOne({ type: 'user', clientSourceId: user.id }, { _id: true })
  const projectPermission = await ProjectPermission.findOne({ clientId: client.id, projectId })

  if (!projectPermission) throw new ApiError(NOT_FOUND)

  next()
}

module.exports = { checkUserIdPermissions }
