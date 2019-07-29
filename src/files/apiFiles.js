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

  async getFile(fileId) {
    return File.findById(fileId, { _id: false, buffer: true, mimetype: true })
  }
}

module.exports = { apiFiles: new ApiFiles() }
