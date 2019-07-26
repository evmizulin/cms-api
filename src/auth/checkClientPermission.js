const { ApiError } = require('../helpers/ApiError')
const { ClientPermission } = require('../services/db/Db')
const { FORBIDDEN } = require('http-status-codes')

const checkClientPermission = action => async (req, res, next) => {
  const { clientId } = req.extractedProps
  const clientPermission = await ClientPermission.findOne({ clientId })

  if (!clientPermission[action]) throw new ApiError(FORBIDDEN, 'Client have no permission for this action')

  next()
}

module.exports = { checkClientPermission }
