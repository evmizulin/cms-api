const { ApiToken } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { isIdValid } = require('../../helpers/isIdValid')
const { NOT_FOUND } = require('http-status-codes')
const { generateToken } = require('./helpers/generateToken')
const { createApiToken } = require('./types/api-token/createApiToken')

class ApiTokens {
  async getApiTokens(projectId) {
    return await ApiToken.find({ projectId }, '-projectId')
  }

  async postApiToken(projectId, token) {
    const createdToken = createApiToken(token, { noId: true })
    await ApiToken.save({ projectId, token: generateToken(), ...createdToken })
  }

  async putApiToken(projectId, tokenId, token) {
    const idValid = isIdValid(tokenId)
    if (!idValid) throw new ApiError('Unvalid tokenId', NOT_FOUND)
    const entity = await ApiToken.findById(tokenId, '_id projectId')
    if (!entity || entity.projectId !== projectId) throw new ApiError('Api token not found', NOT_FOUND)

    const createdToken = createApiToken(token, { noId: false })
    await ApiToken.update(tokenId, { name: createdToken.name })
  }

  async deleteApiToken(projectId, tokenId) {
    const idValid = isIdValid(tokenId)
    if (!idValid) throw new ApiError('Unvalid tokenId', NOT_FOUND)
    const entity = await ApiToken.findById(tokenId, '_id projectId')
    if (!entity || entity.projectId !== projectId) throw new ApiError('Api token not found', NOT_FOUND)

    await ApiToken.remove(tokenId)
  }
}

module.exports = { apiTokens: new ApiTokens() }
