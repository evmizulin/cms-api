const cors = require('cors')
const { allowAll } = require('../helpers/corsSettings')
const { apiEntries } = require('./apiEntries')
const { extractProjectId } = require('../auth/extractProjectId')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { checkProjectPermission } = require('../auth/checkProjectPermission')
const { ApiResp } = require('../helpers/ApiResp')
const { extractEntryId } = require('./extractEntryId')
const { checkEntryPermissions } = require('./checkEntryPermissions')

const setEntriesRoutes = app => {
  app.options('/projects/:projectId/entries', cors(allowAll))

  app.post(
    '/projects/:projectId/entries',
    cors(allowAll),
    extractClientId,
    checkClientPermission('entryCreate'),
    extractProjectId,
    checkProjectPermission('entryCreate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(await apiEntries.postEntry(projectId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.get(
    '/projects/:projectId/entries',
    cors(allowAll),
    extractClientId,
    checkClientPermission('entryRead'),
    extractProjectId,
    checkProjectPermission('entryRead'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const { apiId } = req.query
      const apiResp = new ApiResp(await apiEntries.getEntries(projectId, apiId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/entries/:entryId', cors(allowAll))

  app.get(
    '/projects/:projectId/entries/:entryId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('entryRead'),
    extractProjectId,
    checkProjectPermission('entryRead'),
    extractEntryId,
    checkEntryPermissions,
    async (req, res) => {
      const { projectId, entryId } = req.extractedProps
      const apiResp = new ApiResp(await apiEntries.getEntry(projectId, entryId))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.put(
    '/projects/:projectId/entries/:entryId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('entryUpdate'),
    extractProjectId,
    checkProjectPermission('entryUpdate'),
    extractEntryId,
    checkEntryPermissions,
    async (req, res) => {
      const { projectId, entryId } = req.extractedProps
      const apiResp = new ApiResp(await apiEntries.putEntry(projectId, entryId, req.body))
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.delete(
    '/projects/:projectId/entries/:entryId',
    cors(allowAll),
    extractClientId,
    checkClientPermission('entryDelete'),
    extractProjectId,
    checkProjectPermission('entryDelete'),
    extractEntryId,
    checkEntryPermissions,
    async (req, res) => {
      const { projectId, entryId } = req.extractedProps
      await apiEntries.deleteEntry(projectId, entryId)
      const apiResp = new ApiResp()
      res.status(apiResp.code).send(apiResp.body)
    }
  )
}

module.exports = { setEntriesRoutes }
