/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { ProjectPermission } = require('../../src/services/db/Db')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { routes } = require('./routes')
const { routeDesc, routeParams } = require('./params')
const assert = require('assert')

describe('Check project permissions', () => {
  let auth
  let project
  let connectedAuth
  let connectedProject
  let projectPermission

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    connectedAuth = await getAuth()
    connectedProject = await getProject()
    projectPermission = await getProjectPermission(connectedAuth, connectedProject)
    const { id, projectId, clientId, ...rest } = projectPermission.permission
    await ProjectPermission.update(
      id,
      Object.keys(rest).reduce((res, key) => {
        res[key] = false
        return res
      }, {})
    )
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.checkProjectPermission) return
      it(`${method.toUpperCase()} ${route(routeDesc)}`, done => {
        Promise.all([
          request[method](route({ ...routeParams, projectId: project.project.id }))
            .set('AccessToken', auth.accessToken.token)
            .expect(404, { message: 'Project not found' }),
          request[method](route({ ...routeParams, projectId: connectedProject.project.id }))
            .set('AccessToken', connectedAuth.accessToken.token)
            .expect(403)
            .expect(res => {
              const { message } = res.body
              assert.equal(message.indexOf('Client have no permission to') > -1, true)
              assert.equal(message.indexOf('in this project') > -1, true)
            }),
        ])
          .then(() => done())
          .catch(done)
      })
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await connectedAuth.remove()
    await connectedProject.remove()
    await projectPermission.remove()
  })
})
