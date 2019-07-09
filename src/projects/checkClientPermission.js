const { ApiError } = require('../helpers/ApiError')
const { ClientPermission } = require('../services/db/Db')
const { FORBIDDEN } = require('http-status-codes')

const MAP = {
  POST: 'projectCreate',
  GET: 'projectRead',
  PUT: 'projectUpdate',
  DELETE: 'projectDelete',
}

const checkClientPermission = async (req, res, next) => {
  const { clientId } = req.extractedProps
  const clientPermission = await ClientPermission.findOne({ clientId })

  if (!clientPermission[MAP[req.method]]) throw new ApiError(FORBIDDEN)

  next()
}

module.exports = { checkClientPermission }
