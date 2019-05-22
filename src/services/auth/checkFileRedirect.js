const { File } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { NOT_FOUND, MOVED_TEMPORARILY } = require('http-status-codes')
const { isIdValid } = require('../../helpers/isIdValid')
const { config } = require('../../config')

const checkFileRedirect = async (req, res, next) => {
  const cookieToken = req.cookies.authToken
  const headerApiKey = req.get('ApiKey')
  const { fileId, fileName } = req.params
  if (cookieToken && !headerApiKey) {
    const idValid = isIdValid(fileId)
    if (!idValid) throw new ApiError('Unvalid id', NOT_FOUND)
    const entity = await File.findById(fileId, '_id name projectId')
    if (!entity || entity.name !== fileName) throw new ApiError('File not found', NOT_FOUND)
    res.redirect(
      MOVED_TEMPORARILY,
      `${config.apiUrl}/projects/${entity.projectId}/files/${fileId}/${fileName}`
    )
    return
  }

  next()
}

module.exports = { checkFileRedirect }
