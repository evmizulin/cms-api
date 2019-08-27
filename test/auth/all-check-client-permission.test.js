/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { getApiToken } = require('../helpers/getApiToken')
const { routes } = require('./routes')
const { routeDesc, routeParams } = require('./params')
const assert = require('assert')

describe('Check client permission', () => {
  let apiToken

  before(async () => {
    apiToken = await getApiToken()
  })

  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.checkClientPermission) return
      it(`${method.toUpperCase()} ${route(routeDesc)}`, done => {
        request[method](route(routeParams))
          .set('AccessToken', apiToken.accessToken.token)
          .expect(403)
          .expect(res => {
            const { message } = res.body
            assert.equal(message.indexOf('Client have no permission to') > -1, true)
            assert.equal(message.indexOf('in all projects') > -1, true)
          })
          .end(done)
      })
    })
  })

  after(async () => {
    await apiToken.remove()
  })
})
