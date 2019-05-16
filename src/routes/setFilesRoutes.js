const cors = require('cors')
const { OK } = require('http-status-codes')
const { apiFiles } = require('../services/api/ApiFiles')
const { checkAuth } = require('../services/auth/checkAuth')
const { checkProjectAccess } = require('../services/auth/checkProjectAccess')
const { allowAll, allowMe } = require('../helpers/corsSettings')

const setFilesRoutes = app => {
  app.options('/projects/:projectId/files', cors(allowMe))

  app.post('/projects/:projectId/files', cors(allowMe), checkAuth, checkProjectAccess, async (req, res) => {
    const { projectId } = req.params
    const file = await apiFiles.postFile(projectId, req.files && req.files.file ? req.files.file : null)
    res.status(OK).send(file)
  })

  app.options('/projects/:projectId/files/:fileId/:fileName', cors(allowAll))

  app.get(
    '/projects/:projectId/files/:fileId/:fileName',
    cors(allowAll),
    checkAuth,
    checkProjectAccess,
    async (req, res) => {
      const { projectId, fileId, fileName } = req.params
      const file = await apiFiles.getFile(projectId, fileId, fileName)
      res
        .status(OK)
        .set('Content-Type', file.mimetype)
        .send(file.buffer)
    }
  )
}

module.exports = { setFilesRoutes }
