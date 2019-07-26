/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

describe('DELETE /projects/${id}/users/${id}', () => {
  let auth
  let user
  let project
  let userProjectPermissions

  before(async () => {
    auth = await getAuth()
    user = await getAuth()
    project = await getProject()
    userProjectPermissions = await getProjectPermission(auth, project)
    await getProjectPermission(user, project)
  })

  it('should return 200', done => {
    request
      .delete(`/projects/${project.project.id}/users/${user.user.id}`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await user.remove()
    await project.remove()
    await userProjectPermissions.remove()
  })
})
