const cors = require('cors')
const { apiModels } = require('./apiModels')
const { allowAll } = require('../helpers/corsSettings')
const { extractProjectId } = require('../auth/extractProjectId')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { checkProjectPermission } = require('../auth/checkProjectPermission')
const { ApiResp } = require('../helpers/ApiResp')
const { extractModelId } = require('./extractModelId')
const { checkModelPermissions } = require('./checkModelPermissions')

const setModelsRoutes = app => {
  app.options('/projects/:projectId/models', cors(allowAll))

  app.post(
    '/projects/:projectId/models',
    cors(allowAll),
    extractClientId,
    checkClientPermission('modelCreate'),
    extractProjectId,
    checkProjectPermission('modelCreate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiModels.postModel(projectId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.get(
    '/projects/:projectId/models',
    cors(allowAll),
    extractClientId,
    checkClientPermission('modelRead'),
    extractProjectId,
    checkProjectPermission('modelRead'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiModels.getModels(projectId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/models/:modelId', cors(allowAll))

  app.put(
    '/projects/:projectId/models/:modelId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('modelUpdate'),
    extractProjectId,
    checkProjectPermission('modelUpdate'),
    extractModelId,
    checkModelPermissions,
    async (req, res) => {
      const { projectId, modelId } = req.extractedProps
      const apiResp = new ApiResp(await apiModels.putModel(projectId, modelId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.delete(
    '/projects/:projectId/models/:modelId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('modelDelete'),
    extractProjectId,
    checkProjectPermission('modelDelete'),
    extractModelId,
    checkModelPermissions,
    async (req, res) => {
      const { projectId, modelId } = req.extractedProps
      await apiModels.deleteModel(projectId, modelId)
      const apiResp = new ApiResp()
      res.status(apiResp.code).send(apiResp.body)
    }
  )
}

module.exports = { setModelsRoutes }
