/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { routes } = require('./routes')
const { routeDesc, routeParams } = require('./params')
const { getApiToken } = require('../helpers/getApiToken')

describe('Check app permission', () => {
  let auth
  let project
  let projectPermission
  let apiToken

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
    apiToken = await getApiToken()
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.checkAppPermission) return
      it(`${method.toUpperCase()} ${route(routeDesc)}`, done => {
        request[method](route({ ...routeParams, projectId: project.project.id, appId: apiToken.app.id }))
          .set('AccessToken', auth.accessToken.token)
          .expect(404)
          .end(done)
      })
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
    await apiToken.remove()
  })
})
