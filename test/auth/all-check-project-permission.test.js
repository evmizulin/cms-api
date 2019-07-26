/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { routes } = require('./routes')
const { fakeId } = require('./params')

describe('Check project permissions', () => {
  let auth
  let project

  before(async () => {
    auth = await getAuth()
    project = await getProject()
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.checkProjectPermission) return
      it(`${method.toUpperCase()} ${route('${id}', '${id}')}`, done => {
        Promise.all([
          request[method](route(project.project.id, fakeId))
            .set('AccessToken', auth.accessToken.token)
            .expect(404, { message: 'Project not found' }),
        ])
          .then(() => done())
          .catch(done)
      })
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
  })
})
