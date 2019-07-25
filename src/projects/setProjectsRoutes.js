const cors = require('cors')
const { apiProjects } = require('./apiProjects')
const { allowMe } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')
const { extractProjectId } = require('../auth/extractProjectId')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { checkProjectPermissions } = require('../auth/checkProjectPermissions')

const setProjectsRoutes = app => {
  app.options('/projects', cors(allowMe))

  app.get(
    '/projects',
    cors(allowMe),
    extractClientId,
    checkClientPermission('projectRead'),
    async (req, res) => {
      const { clientId } = req.extractedProps
      const apiResp = new ApiResp(await apiProjects.getProjects(clientId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/image.png', cors(allowMe))

  app.get(
    '/projects/:projectId/image.png',
    cors(allowMe),
    extractClientId,
    checkClientPermission('projectRead'),
    extractProjectId,
    checkProjectPermissions('projectRead'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const image = await apiProjects.getProjectImage(projectId)
      const apiResp = new ApiResp(image.buffer)
      res
        .status(apiResp.code)
        .set('Content-Type', 'image/png')
        .send(apiResp.body)
    }
  )

  app.post(
    '/projects',
    cors(allowMe),
    extractClientId,
    checkClientPermission('projectCreate'),
    async (req, res) => {
      const { clientId } = req.extractedProps
      const apiResp = new ApiResp(await apiProjects.postProject(clientId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId', cors(allowMe))

  app.put(
    '/projects/:projectId',
    cors(allowMe),
    extractClientId,
    checkClientPermission('projectUpdate'),
    extractProjectId,
    checkProjectPermissions('projectUpdate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiProjects.putProject(projectId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.delete(
    '/projects/:projectId',
    cors(allowMe),
    extractClientId,
    checkClientPermission('projectDelete'),
    extractProjectId,
    checkProjectPermissions('projectDelete'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      await apiProjects.deleteProject(projectId)
      const apiResp = new ApiResp()
      res.status(apiResp.code).send(apiResp.body)
    }
  )
}

module.exports = { setProjectsRoutes }
