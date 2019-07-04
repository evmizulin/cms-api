const { ApiError } = require('../helpers/ApiError')
const { Project } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')
const { isIdValid } = require('../helpers/isIdValid')

const checkProjectId = async (req, res, next) => {
  const { projectId } = req.params
  if (!isIdValid(projectId)) throw new ApiError(NOT_FOUND)
  const foundedProject = await Project.findById(projectId, { _id: true })
  if (!foundedProject) throw new ApiError(NOT_FOUND)
  next()
}

module.exports = { checkProjectId }
