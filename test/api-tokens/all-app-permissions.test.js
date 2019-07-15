/*global describe, it, before, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getApiToken } = require('../helpers/getApiToken')

let auth
let project
let projectPermission
let apiToken

describe('Check app permissions', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
    apiToken = await getApiToken()
  })

  const routes = [
    {
      desc: 'PUT api token',
      method: (projectId, appId) => request(app).put(`/projects/${projectId}/api-tokens/${appId}`),
    },
  ]

  routes.forEach(({ desc, method }) => {
    it(`${desc} should return 404`, done => {
      method(project.project.id, apiToken.app.id)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
    await apiToken.remove()
  })
})
