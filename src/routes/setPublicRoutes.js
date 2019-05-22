const cors = require('cors')
const { allowAll, allowMe } = require('../helpers/corsSettings')
const { apiEntries } = require('../services/api/ApiEntries')
const { apiFiles } = require('../services/api/ApiFiles')
const { OK } = require('http-status-codes')
const { checkApiKey } = require('../services/auth/checkApiKey')
const { entryForPublic } = require('../helpers/entryForPublic')
const { checkFileRedirect } = require('../services/auth/checkFileRedirect')
const { getStatusMessage } = require('../helpers/getStatusMessage')
const { apiContacts } = require('../services/api/ApiContacts')

const setPublicRoutes = app => {
  app.options('/entries', cors(allowAll))

  app.get('/entries', cors(allowAll), checkApiKey, async (req, res) => {
    const { projectId } = req
    const { apiId } = req.query
    const entries = await apiEntries.getEntries(projectId, apiId)
    res.status(OK).send(entries.map(entry => entryForPublic(entry)))
  })

  app.options('/entries/:entryId', cors(allowAll))

  app.get('/entries/:entryId', cors(allowAll), checkApiKey, async (req, res) => {
    const { projectId } = req
    const { entryId } = req.params
    const entry = await apiEntries.getEntry(projectId, entryId)
    res.status(OK).send(entryForPublic(entry))
  })

  app.get('/files/:fileId/:fileName', cors(allowAll), checkFileRedirect, checkApiKey, async (req, res) => {
    const { projectId } = req
    const { fileId, fileName } = req.params
    const file = await apiFiles.getFile(projectId, fileId, fileName)
    res
      .status(OK)
      .set('Content-Type', file.mimetype)
      .send(file.buffer)
  })

  app.options('/tmp/contacts', cors(allowMe))

  app.post('/tmp/contacts', cors(allowMe), async (req, res) => {
    const { body } = req
    await apiContacts.postContact(body)
    res.status(OK).send(getStatusMessage(OK))
  })
}

module.exports = { setPublicRoutes }
