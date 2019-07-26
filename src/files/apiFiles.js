const { File } = require('../services/db/Db')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')

class ApiFiles {
  async postFile(projectId, file) {
    if (!file) throw new ApiError(BAD_REQUEST, 'File required')
    const { data: buffer, name, mimetype } = file
    const { buffer: b, ...rest } = await File.insert({ projectId, buffer, name, mimetype })
    return { ...rest }
  }

  // async getFile(projectId, fileId, fileName) {
  //   const idValid = isIdValid(fileId)
  //   if (!idValid) throw new ApiError('Unvalid id', NOT_FOUND)
  //   const entity = await File.findById(fileId, '_id name projectId')
  //   if (!entity || entity.name !== fileName || entity.projectId !== projectId)
  //     throw new ApiError('File not found', NOT_FOUND)
  //
  //   return File.findById(fileId, '-projectId')
  // }
}

module.exports = { apiFiles: new ApiFiles() }
