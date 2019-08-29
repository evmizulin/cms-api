/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getDefaultProjectPermissions } = require('../../src/helpers/getDefaultProjectPermissions')

let auth
let project
let userProjectPermission

describe('GET /projects/${id}/permissions', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
  })

  it('should return 200', done => {
    request
      .get(`/projects/${project.project.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect(res => {
        const permissions = res.body
        assert.deepEqual(permissions, getDefaultProjectPermissions('user'))
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
  })
})
