/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

let auth
let project
let projectPermission
const fakeId = '5d14c75f2d32f92ae2cc831a'
const unvalidId = '5d14c75f2d32f92ae2cc831a'

describe('Check app id', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
  })

  const routes = [
    {
      desc: 'PUT api token',
      method: (projectId, appId) => request.put(`/projects/${projectId}/api-tokens/${appId}`),
    },
    {
      desc: 'DELETE api token',
      method: (projectId, appId) => request.delete(`/projects/${projectId}/api-tokens/${appId}`),
    },
    {
      desc: 'GET api token permissions',
      method: (projectId, appId) => request.get(`/projects/${projectId}/api-tokens/${appId}/permissions`),
    },
  ]

  routes.forEach(({ desc, method }) => {
    it(`${desc} should return 404`, done => {
      method(project.project.id, unvalidId)
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
    await projectPermission.remove()
  })
})
