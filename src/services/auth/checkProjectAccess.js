const { Project, ProjectAndUserRelation } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { FORBIDDEN, NOT_FOUND } = require('http-status-codes')
const { isIdValid } = require('../../helpers/isIdValid')
const { getStatusText } = require('../../helpers/getStatusMessage')

const checkProjectAccess = async (req, res, next) => {
  const { projectId } = req.params
  const { userId } = req
  const idValid = isIdValid(projectId)
  if (!idValid) throw new ApiError('Unvalid projectId', NOT_FOUND)
  const project = await Project.findById(projectId, '_id')
  if (!project) throw new ApiError('Project not found', NOT_FOUND)

  const projectIds = await ProjectAndUserRelation.find({ userId }, 'projectId')
  if (!projectIds.some(item => item.projectId === projectId))
    throw new ApiError(getStatusText(FORBIDDEN), FORBIDDEN)
  next()
}

module.exports = { checkProjectAccess }
