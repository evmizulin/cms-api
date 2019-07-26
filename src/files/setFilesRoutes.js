const cors = require('cors')
// const { OK } = require('http-status-codes')
// const { checkAuth } = require('../services/auth/checkAuth')
// const { checkProjectAccess } = require('../services/auth/checkProjectAccess')
const { apiFiles } = require('./apiFiles')
const { allowAll } = require('../helpers/corsSettings')
const { extractProjectId } = require('../auth/extractProjectId')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { checkProjectPermissions } = require('../auth/checkProjectPermissions')
const { ApiResp } = require('../helpers/ApiResp')

const setFilesRoutes = app => {
  app.options('/projects/:projectId/files', cors(allowAll))

  app.post(
    '/projects/:projectId/files',
    cors(allowAll),
    extractClientId,
    checkClientPermission('fileCreate'),
    extractProjectId,
    checkProjectPermissions('fileCreate'),
    async (req, res) => {
      const { projectId } = req.extractedProps
      const apiResp = new ApiResp(
        await apiFiles.postFile(projectId, req.files && req.files.file ? req.files.file : null)
      )
      res.status(apiResp.code).send(apiResp.body)
    }
  )
  //
  // app.options('/projects/:projectId/files/:fileId/:fileName', cors(allowAll))
  //
  // app.get(
  //   '/projects/:projectId/files/:fileId/:fileName',
  //   cors(allowAll),
  //   checkAuth,
  //   checkProjectAccess,
  //   async (req, res) => {
  //     const { projectId, fileId, fileName } = req.params
  //     const file = await apiFiles.getFile(projectId, fileId, fileName)
  //     res
  //       .status(OK)
  //       .set('Content-Type', file.mimetype)
  //       .send(file.buffer)
  //   }
  // )
}

module.exports = { setFilesRoutes }
