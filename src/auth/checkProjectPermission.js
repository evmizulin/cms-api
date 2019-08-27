const { ApiError } = require('../helpers/ApiError')
const { ProjectPermission } = require('../services/db/Db')
const { FORBIDDEN, NOT_FOUND } = require('http-status-codes')

const checkProjectPermission = action => async (req, res, next) => {
  const { clientId, projectId } = req.extractedProps

  const projectPermission = await ProjectPermission.findOne({ clientId, projectId })

  if (!projectPermission) throw new ApiError(NOT_FOUND, 'Project not found')
  if (!projectPermission[action])
    throw new ApiError(FORBIDDEN, `Client have no permission to "${action}" in this project`)

  next()
}

module.exports = { checkProjectPermission }
