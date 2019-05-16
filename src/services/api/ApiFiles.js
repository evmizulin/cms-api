const { File } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { isIdValid } = require('../../helpers/isIdValid')
const { NOT_FOUND, BAD_REQUEST } = require('http-status-codes')

class ApiFiles {
  async postFile(projectId, file) {
    if (!file) throw new ApiError('File required', BAD_REQUEST)
    const { data: buffer, name, mimetype } = file
    const { buffer: a, projectId: b, ...rest } = await File.save({ projectId, buffer, name, mimetype })
    return { ...rest }
  }

  async getFile(projectId, fileId, fileName) {
    const idValid = isIdValid(fileId)
    if (!idValid) throw new ApiError('Unvalid id', NOT_FOUND)
    const entity = await File.findById(fileId, '_id name projectId')
    if (!entity || entity.name !== fileName || entity.projectId !== projectId)
      throw new ApiError('File not found', NOT_FOUND)

    return File.findById(fileId, '-projectId')
  }
}

module.exports = { apiFiles: new ApiFiles() }
