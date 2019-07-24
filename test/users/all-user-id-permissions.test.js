/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

describe('Check userId permission', () => {
  let auth
  let user
  let project
  let userProjectPermissions

  const routes = [
    {
      desc: 'DELETE user from project',
      method: (projectId, userId) => request(app).delete(`/projects/${projectId}/users/${userId}`),
    },
    {
      desc: 'GET user permissions',
      method: (projectId, userId) => request(app).get(`/projects/${projectId}/users/${userId}/permissions`),
    },
  ]

  before(async () => {
    auth = await getAuth()
    user = await getAuth()
    project = await getProject()
    userProjectPermissions = await getProjectPermission(auth, project)
  })

  routes.forEach(({ desc, method }) => {
    it(`${desc} should return 404`, done => {
      method(project.project.id, user.user.id)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })
  })

  after(async () => {
    await auth.remove()
    await user.remove()
    await project.remove()
    await userProjectPermissions.remove()
  })
})
