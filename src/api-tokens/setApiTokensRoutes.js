const cors = require('cors')
const { allowAll } = require('../helpers/corsSettings')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { extractProjectId } = require('../auth/extractProjectId')
const { checkProjectPermissions } = require('../auth/checkProjectPermissions')
const { apiTokens } = require('./apiTokens')
const { extractAppId } = require('./extractAppId')
const { checkAppPermissions } = require('./checkAppPermissions')
const { ApiResp } = require('../helpers/ApiResp')

const setApiTokensRoutes = app => {
  app.options('/projects/:projectId/api-tokens', cors(allowAll))

  app.post(
    '/projects/:projectId/api-tokens',
    cors(allowAll),
    extractClientId,
    checkClientPermission('apiTokenCreate'),
    extractProjectId,
    checkProjectPermissions('apiTokenCreate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiTokens.postApiToken(projectId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.get(
    '/projects/:projectId/api-tokens',
    cors(allowAll),
    extractClientId,
    checkClientPermission('apiTokenRead'),
    extractProjectId,
    checkProjectPermissions('apiTokenRead'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiTokens.getApiTokens(projectId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/api-tokens/:appId', cors(allowAll))

  app.put(
    '/projects/:projectId/api-tokens/:appId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('apiTokenUpdate'),
    extractProjectId,
    checkProjectPermissions('apiTokenUpdate'),
    extractAppId,
    checkAppPermissions,
    async (req, res) => {
      const { appId } = req.extractedProps
      const apiResp = new ApiResp(await apiTokens.putApiToken(appId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.delete(
    '/projects/:projectId/api-tokens/:appId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('apiTokenDelete'),
    extractProjectId,
    checkProjectPermissions('apiTokenDelete'),
    extractAppId,
    checkAppPermissions,
    async (req, res) => {
      const { appId, projectId } = req.extractedProps
      await apiTokens.deleteApiToken(projectId, appId)
      const apiResp = new ApiResp()
      res.status(apiResp.code).send(apiResp.body)
    }
  )
}

module.exports = { setApiTokensRoutes }
