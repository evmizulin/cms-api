const { ApiError } = require('../helpers/ApiError')
const { ProjectPermission } = require('../services/db/Db')
const { FORBIDDEN, NOT_FOUND } = require('http-status-codes')

const MAP = {
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete',
}

const checkProjectPermissions = async (req, res, next) => {
  const { clientId, projectId } = req.extractedProps

  const projectPermission = await ProjectPermission.findOne({ clientId, projectId })

  if (!projectPermission) throw new ApiError(NOT_FOUND)
  if (!projectPermission[MAP[req.method]]) throw new ApiError(FORBIDDEN)

  next()
}

module.exports = { checkProjectPermissions }
