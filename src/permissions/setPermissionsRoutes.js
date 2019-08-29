const cors = require('cors')
const { allowMe } = require('../helpers/corsSettings')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { extractProjectId } = require('../auth/extractProjectId')
const { apiPermissions } = require('./apiPermissions')
const { checkProjectPermission } = require('../auth/checkProjectPermission')
const { extractUserId } = require('../users/extractUserId')
const { extractAppId } = require('../api-tokens/extractAppId')
const { checkUserIdPermissions } = require('../users/checkUserIdPermissions')
const { checkAppPermissions } = require('../api-tokens/checkAppPermissions')
const { ApiResp } = require('../helpers/ApiResp')

const setPermissionsRoutes = app => {
  app.options('/projects/:projectId/permissions', cors(allowMe))

  app.get(
    '/projects/:projectId/permissions',
    cors(allowMe),
    extractClientId,
    checkClientPermission('ownPermissionsRead'),
    extractProjectId,
    checkProjectPermission('ownPermissionsRead'),
    async (req, res) => {
      const { projectId, clientId } = req.extractedProps
      const apiResp = new ApiResp(await apiPermissions.getOwnPermissions(projectId, clientId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/users/:userId/permissions', cors(allowMe))

  app.get(
    '/projects/:projectId/users/:userId/permissions',
    cors(allowMe),
    extractClientId,
    checkClientPermission('userPermissionsRead'),
    extractProjectId,
    checkProjectPermission('userPermissionsRead'),
    extractUserId,
    checkUserIdPermissions,
    async (req, res) => {
      const { projectId, userId } = req.extractedProps
      const apiResp = new ApiResp(await apiPermissions.getUserPermissions(projectId, userId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.put(
    '/projects/:projectId/users/:userId/permissions',
    cors(allowMe),
    extractClientId,
    checkClientPermission('userPermissionsUpdate'),
    extractProjectId,
    checkProjectPermission('userPermissionsUpdate'),
    extractUserId,
    checkUserIdPermissions,
    async (req, res) => {
      const { projectId, userId } = req.extractedProps
      const apiResp = new ApiResp(await apiPermissions.updateUserPermissions(projectId, userId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/api-tokens/:appId/permissions', cors(allowMe))

  app.get(
    '/projects/:projectId/api-tokens/:appId/permissions',
    cors(allowMe),
    extractClientId,
    checkClientPermission('apiTokenPermissionsRead'),
    extractProjectId,
    checkProjectPermission('apiTokenPermissionsRead'),
    extractAppId,
    checkAppPermissions,
    async (req, res) => {
      const { appId, projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiPermissions.getApiTokenPermissions(projectId, appId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.put(
    '/projects/:projectId/api-tokens/:appId/permissions',
    cors(allowMe),
    extractClientId,
    checkClientPermission('apiTokenPermissionsUpdate'),
    extractProjectId,
    checkProjectPermission('apiTokenPermissionsUpdate'),
    extractAppId,
    checkAppPermissions,
    async (req, res) => {
      const { appId, projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiPermissions.updateApiTokenPermissions(projectId, appId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )
}

module.exports = { setPermissionsRoutes }
