const cors = require('cors')
const { allowAll } = require('../helpers/corsSettings')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { extractProjectId } = require('../auth/extractProjectId')
const { apiUsers } = require('./apiUsers')
const { OK } = require('http-status-codes')
const { checkProjectPermissions } = require('../auth/checkProjectPermissions')
const { extractUserId } = require('../users/extractUserId')
const { checkUserIdPermissions } = require('../users/checkUserIdPermissions')
const { ApiResp } = require('../helpers/ApiResp')

const setUsersRoutes = app => {
  app.options('/users', cors(allowAll))

  app.get('/users', cors(allowAll), extractClientId, checkClientPermission('userRead'), async (req, res) => {
    const { login } = req.query
    const users = await apiUsers.search(login)
    res.status(OK).send(users)
  })

  app.options('/projects/:projectId/users', cors(allowAll))

  app.post(
    '/projects/:projectId/users',
    cors(allowAll),
    extractClientId,
    checkClientPermission('userOfProjectCreate'),
    extractProjectId,
    checkProjectPermissions('userOfProjectCreate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const user = await apiUsers.addUserToProject(projectId, req.body)
      res.status(OK).send(user)
    }
  )

  app.get(
    '/projects/:projectId/users',
    cors(allowAll),
    extractClientId,
    checkClientPermission('userOfProjectRead'),
    extractProjectId,
    checkProjectPermissions('userOfProjectRead'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const users = await apiUsers.getUsersOfProject(projectId)
      res.status(OK).send(users)
    }
  )

  app.options('/projects/:projectId/users/:userId', cors(allowAll))

  app.delete(
    '/projects/:projectId/users/:userId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('userOfProjectDelete'),
    extractProjectId,
    checkProjectPermissions('userOfProjectDelete'),
    extractUserId,
    checkUserIdPermissions,
    async (req, res) => {
      const { projectId, userId } = req.extractedProps
      await apiUsers.deleteUserOfProject(projectId, userId)
      const apiResp = new ApiResp(OK)
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/users/:userId/permissions', cors(allowAll))

  app.get(
    '/projects/:projectId/users/:userId/permissions',
    cors(allowAll),
    extractClientId,
    checkClientPermission('permissionsRead'),
    extractProjectId,
    checkProjectPermissions('permissionsRead'),
    extractUserId,
    checkUserIdPermissions,
    async (req, res) => {
      const { projectId, userId } = req.extractedProps
      const permissions = await apiUsers.getPermissions(projectId, userId)
      res.status(OK).send(permissions)
    }
  )
}

module.exports = { setUsersRoutes }
