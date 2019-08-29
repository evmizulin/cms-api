/*global describe, it, after, before*/

const { request } = require('../helpers/request')
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
    request
      .put(`/projects/${project.project.id}/users/${auth.user.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({})
      .expect(400)
      .end(done)
  })

  it('should return 200', done => {
    const defaultPermissions = getDefaultProjectPermissions('user')
    request
      .put(`/projects/${project.project.id}/users/${auth.user.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send(
        Object.keys(defaultPermissions).reduce((res, key) => {
          res[key] = defaultPermissions[key]
          if (key === 'userPermissionsUpdate') res[key] = false
          return res
        }, {})
      )
      .expect(200)
      .expect(res => {
        const { userPermissionsUpdate, ...rest } = res.body
        const defaultPermissions = getDefaultProjectPermissions('user')
        delete defaultPermissions.userPermissionsUpdate
        assert.equal(userPermissionsUpdate, false)
        assert.deepEqual(rest, defaultPermissions)
      })
      .end(done)
  })

  it('should return 403', done => {
    request
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
