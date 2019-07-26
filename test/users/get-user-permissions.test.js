/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getDefaultProjectPermissions } = require('../../src/helpers/getDefaultProjectPermissions')

describe('GET /projects/${id}/users/${id}/permissions', () => {
  let auth
  let project
  let userProjectPermission

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
  })

  it('should return 200', done => {
    request
      .get(`/projects/${project.project.id}/users/${auth.user.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect(res => {
        const { id, userId, projectId, ...rest } = res.body
        assert.equal(userId, auth.user.id.toString())
        assert.equal(projectId, project.project.id.toString())
        assert.deepEqual(rest, getDefaultProjectPermissions('user'))
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
  })
})
