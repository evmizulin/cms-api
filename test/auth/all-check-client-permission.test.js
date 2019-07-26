/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getApiToken } = require('../helpers/getApiToken')
const { routes } = require('./routes')
const { fakeId } = require('./params')

describe('Check client permission', () => {
  let apiToken

  before(async () => {
    apiToken = await getApiToken()
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.checkClientPermission) return
      it(`${method.toUpperCase()} ${route('${id}', '${id}')}`, done => {
        request[method](route(fakeId, fakeId))
          .set('AccessToken', apiToken.accessToken.token)
          .expect(403, { message: 'Client have no permission for this action' })
          .end(done)
      })
    })
  })

  after(async () => {
    await apiToken.remove()
  })
})
