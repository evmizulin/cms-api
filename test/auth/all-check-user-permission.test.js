/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { routes } = require('./routes')
const { routeDesc, routeParams } = require('./params')

describe('Check user permission', () => {
  let auth
  let user
  let project
  let userProjectPermissions

  before(async () => {
    auth = await getAuth()
    user = await getAuth()
    project = await getProject()
    userProjectPermissions = await getProjectPermission(auth, project)
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.checkUserPermission) return
      it(`${method.toUpperCase()} ${route(routeDesc)}`, done => {
        request[method](route({ ...routeParams, projectId: project.project.id, userId: user.user.id }))
          .set('AccessToken', auth.accessToken.token)
          .expect(404, { message: 'User is not found' })
          .end(done)
      })
    })
  })

  after(async () => {
    await auth.remove()
    await user.remove()
    await project.remove()
    await userProjectPermissions.remove()
  })
})
