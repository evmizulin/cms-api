/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

let auth
let project
let projectPermission

describe('PUT /projects/${id}', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
  })

  it('should return 200', done => {
    request(app)
      .put(`/projects/${project.project.id}`)
      .set('AccessToken', auth.accessToken.token)
      .send({ id: project.project.id, name: 'put-project-success-new' })
      .expect(200)
      .expect(res => {
        const { id, name, ...rest } = res.body
        assert.equal(name, 'put-project-success-new')
        assert.equal(id, project.project.id)
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .put(`/projects/${project.project.id}`)
      .set('AccessToken', auth.accessToken.token)
      .send({ id: '5d14c75f2d32f92ae2cc831b', name: 'put-project-fail' })
      .expect(400)
      .expect({ message: 'ID in route must be equal to ID in body' })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
  })
})
