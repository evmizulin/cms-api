const cors = require('cors')
const { allowMe } = require('../helpers/corsSettings')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { extractProjectId } = require('../auth/extractProjectId')
const { apiPermissions } = require('./apiPermissions')
const { checkProjectPermission } = require('../auth/checkProjectPermission')
const { extractUserId } = require('../users/extractUserId')
const { checkUserIdPermissions } = require('../users/checkUserIdPermissions')
const { ApiResp } = require('../helpers/ApiResp')

const setPermissionsRoutes = app => {
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
}

module.exports = { setPermissionsRoutes }
