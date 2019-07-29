/*global describe, it*/

const { request } = require('../helpers/request')
const { routes } = require('./routes')
const { fakeAccessToken, routeDesc, routeParams } = require('./params')

describe('Extract clientId by AccessToken', () => {
  routes.forEach(({ route, methods }) => {
    methods.forEach(({ method, tests }) => {
      if (!tests.extractClientId) return
      it(`${method.toUpperCase()} ${route(routeDesc)}`, done => {
        Promise.all([
          request[method](route(routeParams)).expect(401, {
            message: 'AccessToken is not provided',
          }),
          request[method](route(routeParams))
            .set('AccessToken', fakeAccessToken)
            .expect(401, { message: 'AccessToken is not exist' }),
        ])
          .then(() => done())
          .catch(done)
      })
    })
  })
})
