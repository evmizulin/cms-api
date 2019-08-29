const cors = require('cors')
const { allowMe } = require('../helpers/corsSettings')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { extractProjectId } = require('../auth/extractProjectId')
const { apiUsers } = require('./apiUsers')
const { checkProjectPermission } = require('../auth/checkProjectPermission')
const { extractUserId } = require('../users/extractUserId')
const { checkUserIdPermissions } = require('../users/checkUserIdPermissions')
const { ApiResp } = require('../helpers/ApiResp')

const setUsersRoutes = app => {
  app.options('/users', cors(allowMe))

  app.get(
    '/users',
    cors(allowMe),
    extractClientId,
    checkClientPermission('userOfCmsRead'),
    async (req, res) => {
      const { login } = req.query
      const apiResp = new ApiResp(await apiUsers.search(login))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/users', cors(allowMe))

  app.post(
    '/projects/:projectId/users',
    cors(allowMe),
    extractClientId,
    checkClientPermission('userOfProjectCreate'),
    extractProjectId,
    checkProjectPermission('userOfProjectCreate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiUsers.addUserToProject(projectId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.get(
    '/projects/:projectId/users',
    cors(allowMe),
    extractClientId,
    checkClientPermission('userOfProjectRead'),
    extractProjectId,
    checkProjectPermission('userOfProjectRead'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiUsers.getUsersOfProject(projectId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/users/:userId', cors(allowMe))

  app.delete(
    '/projects/:projectId/users/:userId',
    cors(allowMe),
    extractClientId,
    checkClientPermission('userOfProjectDelete'),
    extractProjectId,
    checkProjectPermission('userOfProjectDelete'),
    extractUserId,
    checkUserIdPermissions,
    async (req, res) => {
      const { projectId, userId } = req.extractedProps
      await apiUsers.deleteUserOfProject(projectId, userId)
      const apiResp = new ApiResp()
      res.status(apiResp.code).send(apiResp.body)
    }
  )
}

module.exports = { setUsersRoutes }
