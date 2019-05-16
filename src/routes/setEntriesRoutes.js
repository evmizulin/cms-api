const cors = require('cors')
const { OK } = require('http-status-codes')
const { getStatusMessage } = require('../helpers/getStatusMessage')
const { checkAuth } = require('../services/auth/checkAuth')
const { checkProjectAccess } = require('../services/auth/checkProjectAccess')
const { allowMe } = require('../helpers/corsSettings')
const { apiEntries } = require('../services/api/ApiEntries')

const setEntriesRoutes = app => {
  app.options('/projects/:projectId/entries', cors(allowMe))

  app.get('/projects/:projectId/entries', cors(allowMe), checkAuth, checkProjectAccess, async (req, res) => {
    const { projectId } = req.params
    const entries = await apiEntries.getEntries(projectId)
    res.status(OK).send(entries)
  })

  app.post('/projects/:projectId/entries', cors(allowMe), checkAuth, checkProjectAccess, async (req, res) => {
    const { projectId } = req.params
    await apiEntries.postEntry(projectId, req.body)
    res.status(OK).send(getStatusMessage(OK))
  })

  app.options('/projects/:projectId/entries/:entryId', cors(allowMe))

  app.put(
    '/projects/:projectId/entries/:entryId',
    cors(allowMe),
    checkAuth,
    checkProjectAccess,
    async (req, res) => {
      const { projectId, entryId } = req.params
      await apiEntries.putEntry(projectId, entryId, req.body)
      res.status(OK).send(getStatusMessage(OK))
    }
  )

  app.delete(
    '/projects/:projectId/entries/:entryId',
    cors(allowMe),
    checkAuth,
    checkProjectAccess,
    async (req, res) => {
      const { projectId, entryId } = req.params
      await apiEntries.deleteEntry(projectId, entryId)
      res.status(OK).send(getStatusMessage(OK))
    }
  )
}

module.exports = { setEntriesRoutes }
