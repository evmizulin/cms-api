/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { routes } = require('./routes')
const { unvalidId, fakeId } = require('./params')

describe('Extract projectId', () => {
  let auth

  before(async () => {
    auth = await getAuth()
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.extractProjectId) return
      it(`${method.toUpperCase()} ${route('${id}', '${id}')}`, done => {
        Promise.all([
          request[method](route(unvalidId, unvalidId))
            .set('AccessToken', auth.accessToken.token)
            .expect(404),
          request[method](route(fakeId, fakeId))
            .set('AccessToken', auth.accessToken.token)
            .expect(404),
        ])
          .then(() => done())
          .catch(done)
      })
    })
  })

  after(async () => {
    await auth.remove()
  })
})
