const cors = require('cors')
const { OK } = require('http-status-codes')
const { getStatusMessage } = require('../helpers/getStatusMessage')
const { apiTokens } = require('../services/api/ApiTokens')
const { checkAuth } = require('../services/auth/checkAuth')
const { checkProjectAccess } = require('../services/auth/checkProjectAccess')
const { allowMe } = require('../helpers/corsSettings')

const setTokensRoutes = app => {
  app.options('/projects/:projectId/tokens', cors(allowMe))

  app.get('/projects/:projectId/tokens', cors(allowMe), checkAuth, checkProjectAccess, async (req, res) => {
    const { projectId } = req.params
    const tokens = await apiTokens.getApiTokens(projectId)
    res.status(OK).send(tokens)
  })

  app.post('/projects/:projectId/tokens', cors(allowMe), checkAuth, checkProjectAccess, async (req, res) => {
    const { projectId } = req.params
    await apiTokens.postApiToken(projectId, req.body)
    res.status(OK).send(getStatusMessage(OK))
  })

  app.options('/projects/:projectId/tokens/:tokenId', cors(allowMe))

  app.put(
    '/projects/:projectId/tokens/:tokenId',
    cors(allowMe),
    checkAuth,
    checkProjectAccess,
    async (req, res) => {
      const { projectId, tokenId } = req.params
      await apiTokens.putApiToken(projectId, tokenId, req.body)
      res.status(OK).send(getStatusMessage(OK))
    }
  )

  app.delete(
    '/projects/:projectId/tokens/:tokenId',
    cors(allowMe),
    checkAuth,
    checkProjectAccess,
    async (req, res) => {
      const { projectId, tokenId } = req.params
      await apiTokens.deleteApiToken(projectId, tokenId)
      res.status(OK).send(getStatusMessage(OK))
    }
  )
}

module.exports = { setTokensRoutes }
