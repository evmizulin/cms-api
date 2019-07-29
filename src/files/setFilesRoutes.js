const cors = require('cors')
// const { OK } = require('http-status-codes')
// const { checkAuth } = require('../services/auth/checkAuth')
// const { checkProjectAccess } = require('../services/auth/checkProjectAccess')
const { apiFiles } = require('./apiFiles')
const { allowAll } = require('../helpers/corsSettings')
const { extractProjectId } = require('../auth/extractProjectId')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { checkProjectPermission } = require('../auth/checkProjectPermission')
const { ApiResp } = require('../helpers/ApiResp')
const { extractFileId } = require('./extractFileId')
const { checkFilePermission } = require('./checkFilePermission')

const setFilesRoutes = app => {
  app.options('/projects/:projectId/files', cors(allowAll))

  app.post(
    '/projects/:projectId/files',
    cors(allowAll),
    extractClientId,
    checkClientPermission('fileCreate'),
    extractProjectId,
    checkProjectPermission('fileCreate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(
        await apiFiles.postFile(projectId, req.files && req.files.file ? req.files.file : null)
      )
      res.status(apiResp.code).send(apiResp.body)
    }
  )

  app.options('/projects/:projectId/files/:fileId/:fileName', cors(allowAll))

  app.get(
    '/projects/:projectId/files/:fileId/:fileName',
    cors(allowAll),
    extractClientId,
    checkClientPermission('fileRead'),
    extractProjectId,
    checkProjectPermission('fileRead'),
    extractFileId,
    checkFilePermission,
    async (req, res) => {
      const { fileId } = req.extractedProps
      const file = await apiFiles.getFile(fileId)
      const apiResp = new ApiResp(file.buffer)
      res
        .status(apiResp.code)
        .set('Content-Type', file.mimetype)
        .send(apiResp.body)
    }
  )
}

module.exports = { setFilesRoutes }
