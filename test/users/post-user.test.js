/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { ProjectPermission } = require('../../src/services/db/Db')

let auth
let user
let project
let userProjectPermission

describe('POST /projects/${id}/users', () => {
  before(async () => {
    auth = await getAuth()
    user = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
  })

  it('should return 200', done => {
    request(app)
      .post(`/projects/${project.project.id}/users`)
      .set('AccessToken', auth.accessToken.token)
      .send({ id: user.user.id, login: user.user.login })
      .expect(200)
      .expect(res => {
        const { id, login, ...rest } = res.body
        assert.equal(id, user.user.id.toString())
        assert.equal(login, user.user.login)
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post(`/projects/${project.project.id}/users`)
      .set('AccessToken', auth.accessToken.token)
      .send({})
      .expect(400)
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post(`/projects/${project.project.id}/users`)
      .set('AccessToken', auth.accessToken.token)
      .send({ id: user.user.id, login: `${user.user.login}a` })
      .expect(400)
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post(`/projects/${project.project.id}/users`)
      .set('AccessToken', auth.accessToken.token)
      .send({ id: user.user.id, login: user.user.login })
      .expect(400)
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await user.remove()
    await project.remove()
    await userProjectPermission.remove()
    const projectPermission = await ProjectPermission.findOne({
      clientId: user.client.id,
      projectId: project.project.id,
    })
    await ProjectPermission.remove(projectPermission.id)
  })
})
