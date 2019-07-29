/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { File } = require('../../src/services/db/Db')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { routes } = require('./routes')
const { routeDesc, routeParams } = require('./params')
const randomstring = require('randomstring')

describe('Check file permission', () => {
  let auth
  let project
  let otherProject
  let projectPermission
  let otherProjectPermission
  let file

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    otherProject = await getProject()
    projectPermission = await getProjectPermission(auth, project)
    otherProjectPermission = await getProjectPermission(auth, otherProject)
    file = await File.insert({
      projectId: project.project.id,
      name: randomstring.generate(),
      buffer: new Buffer(1),
      mimetype: randomstring.generate(),
    })
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.checkFilePermission) return
      it(`${method.toUpperCase()} ${route(routeDesc)}`, done => {
        request[method](
          route({ ...routeParams, projectId: otherProject.project.id, fileId: file.id, fileName: file.name })
        )
          .set('AccessToken', auth.accessToken.token)
          .expect(404)
          .end(done)
      })
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await otherProject.remove()
    await projectPermission.remove()
    await otherProjectPermission.remove()
    await File.remove(file.id)
  })
})
