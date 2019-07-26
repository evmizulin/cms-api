/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
// const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
// const { ProjectPermission } = require('../../src/services/db/Db')

describe('Check userId', () => {
  let auth
  let project
  let userProjectPermissions
  const fakeId = '5d14c75f2d32f92ae2cc831a'

  const routes = [
    {
      desc: 'DELETE user from project',
      method: (projectId, userId) => request.delete(`/projects/${projectId}/users/${userId}`),
    },
    {
      desc: 'GET user permissions',
      method: (projectId, userId) => request.get(`/projects/${projectId}/users/${userId}/permissions`),
    },
    {
      desc: 'PUT user permissions',
      method: (projectId, userId) => request.put(`/projects/${projectId}/users/${userId}/permissions`),
    },
  ]

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermissions = await getProjectPermission(auth, project)
  })

  routes.forEach(({ desc, method }) => {
    it(`${desc} should return 404`, done => {
      method(project.project.id, `${fakeId}aaa`)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })

    it(`${desc} should return 404`, done => {
      method(project.project.id, fakeId)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermissions.remove()
  })
})
