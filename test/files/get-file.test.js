/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { File } = require('../../src/services/db/Db')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const randomstring = require('randomstring')

describe('GET /projects/${id}/files/${id}/${fileName}', () => {
  let auth
  let project
  let projectPermission
  let file

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
    file = await File.insert({
      projectId: project.project.id,
      name: randomstring.generate(),
      buffer: new Buffer(1),
      mimetype: randomstring.generate(),
    })
  })

  it('should return 200', done => {
    request
      .get(`/projects/${project.project.id}/files/${file.id}/${file.name}`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect('Content-Type', file.mimetype)
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
    await File.remove(file.id)
  })
})
