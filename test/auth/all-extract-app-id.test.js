/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { routes } = require('./routes')
const { unvalidId, routeDesc, routeParams } = require('./params')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

describe('Extract appId', () => {
  let auth
  let project
  let projectPermission

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.extractAppId) return
      it(`${method.toUpperCase()} ${route(routeDesc)}`, done => {
        Promise.all([
          request[method](route({ ...routeParams, projectId: project.project.id, appId: unvalidId }))
            .set('AccessToken', auth.accessToken.token)
            .expect(404, { message: 'ApiTokenId is not valid' }),
          request[method](route({ ...routeParams, projectId: project.project.id }))
            .set('AccessToken', auth.accessToken.token)
            .expect(404, { message: 'ApiToken not found' }),
        ])
          .then(() => done())
          .catch(done)
      })
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
  })
})
