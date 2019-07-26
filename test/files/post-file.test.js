/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { File } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

let auth
let project
let userProjectPermission

describe('POST /projects/${id}/files', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
  })

  it('should return 200', done => {
    request
      .post(`/projects/${project.project.id}/files`)
      .attach('file', `${__dirname}/img.jpg`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect(res => {
        const { id, projectId, name, mimetype, ...rest } = res.body
        assert.equal(!!id, true)
        assert.equal(projectId, project.project.id.toString())
        assert.equal(name, 'img.jpg')
        assert.equal(mimetype, 'image/jpeg')
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  it('should return 400', done => {
    request
      .post(`/projects/${project.project.id}/files`)
      .set('AccessToken', auth.accessToken.token)
      .send({})
      .expect(400)
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
    const file = await File.findOne({ projectId: project.project.id })
    await File.remove(file.id)
  })
})
