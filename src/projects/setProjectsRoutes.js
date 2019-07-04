const cors = require('cors')
const { OK } = require('http-status-codes')
const { apiProjects } = require('./apiProjects')
// const { checkAuth } = require('../services/auth/checkAuth')
// const { checkProjectAccess } = require('../services/auth/checkProjectAccess')
const { allowAll } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')
const { checkProjectId } = require('./checkProjectId')

const setProjectsRoutes = app => {
  app.options('/projects', cors(allowAll))
  //
  // app.get('/projects', cors(allowMe), checkAuth, async (req, res) => {
  //   const { userId } = req
  //   const projects = await apiProjects.getProjects(userId)
  //   res.status(OK).send(projects)
  // })

  app.get('/projects', cors(allowAll), async (req, res) => {
    const projects = await apiProjects.getProjects()
    res.status(OK).send(projects)
  })

  app.options('/projects/:projectId/image.png', cors(allowAll))

  app.get('/projects/:projectId/image.png', cors(allowAll), checkProjectId, async (req, res) => {
    const { projectId } = req.params
    const image = await apiProjects.getProjectImage(projectId)
    res
      .status(OK)
      .set('Content-Type', 'image/png')
      .send(image.buffer)
  })

  // app.post('/projects', cors(allowMe), checkAuth, async (req, res) => {
  //   const { userId } = req
  //   await apiProjects.postProject(userId, req.body)
  //   res.status(OK).send(getStatusMessage(OK))
  // })

  app.post('/projects', cors(allowAll), async (req, res) => {
    const savedProject = await apiProjects.postProject(req.body)
    res.status(OK).send(savedProject)
  })

  app.options('/projects/:projectId', cors(allowAll))
  //
  // app.put('/projects/:projectId', cors(allowMe), checkAuth, checkProjectAccess, async (req, res) => {
  //   const { projectId } = req.params
  //   await apiProjects.putProject(projectId, req.body)
  //   res.status(OK).send(getStatusMessage(OK))
  // })

  app.put('/projects/:projectId', cors(allowAll), checkProjectId, async (req, res) => {
    const { projectId } = req.params
    const updatedProject = await apiProjects.putProject(projectId, req.body)
    res.status(OK).send(updatedProject)
  })
  //
  // app.delete('/projects/:projectId', cors(allowMe), checkAuth, checkProjectAccess, async (req, res) => {
  //   const { projectId } = req.params
  //   await apiProjects.deleteProject(projectId)
  //   res.status(OK).send(getStatusMessage(OK))
  // })

  app.delete('/projects/:projectId', cors(allowAll), checkProjectId, async (req, res) => {
    const { projectId } = req.params
    await apiProjects.deleteProject(projectId)
    const apiResp = new ApiResp(OK)
    res.status(apiResp.code).send(apiResp.body)
  })
}

module.exports = { setProjectsRoutes }
