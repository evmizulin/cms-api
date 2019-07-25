/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getDefaultProjectPermissions } = require('../../src/helpers/getDefaultProjectPermissions')

describe('PUT /projects/${id}/users/${id}/permissions', () => {
  let auth
  let project
  let userProjectPermission

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
  })

  it('should return 400', done => {
    request(app)
      .put(`/projects/${project.project.id}/users/${auth.user.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({})
      .expect(400)
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .put(`/projects/${project.project.id}/users/${auth.user.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({
        userId: project.project.id,
        projectId: project.project.id,
        ...getDefaultProjectPermissions('user'),
      })
      .expect(400)
      .end(done)
  })

  it('should return 200', done => {
    const defaultPermissions = getDefaultProjectPermissions('user')
    request(app)
      .put(`/projects/${project.project.id}/users/${auth.user.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({
        userId: auth.user.id,
        projectId: project.project.id,
        ...Object.keys(defaultPermissions).reduce((res, key) => {
          res[key] = defaultPermissions[key]
          if (key === 'permissionsUpdate') res[key] = false
          return res
        }, {}),
      })
      .expect(200)
      .expect(res => {
        const { userId, projectId, permissionsUpdate, ...rest } = res.body
        const defaultPermissions = getDefaultProjectPermissions('user')
        delete defaultPermissions.permissionsUpdate
        assert.equal(userId, auth.user.id.toString())
        assert.equal(projectId, project.project.id.toString())
        assert.equal(permissionsUpdate, false)
        assert.deepEqual(rest, defaultPermissions)
      })
      .end(done)
  })

  it('should return 403', done => {
    request(app)
      .put(`/projects/${project.project.id}/users/${auth.user.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({})
      .expect(403)
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
  })
})
