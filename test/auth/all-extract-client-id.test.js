/*global describe, it*/

const { request } = require('../helpers/request')
const { routes } = require('./routes')

const fakeAccessToken = 'ad08ddacfb97b193a843e1cb7608c28cc2aa08b8'
const fakeId = '5d14c75f2d32f92ae2cc831a'

describe('Extract clientId by AccessToken', () => {
  routes.forEach(({ route, methods }) => {
    methods.forEach(method => {
      it(`${method.toUpperCase()} ${route('${id}', '${id}', '${id}')}`, done => {
        Promise.all([
          request[method](route(fakeId)).expect(401),
          request[method](route(fakeId))
            .set('AccessToken', fakeAccessToken)
            .expect(401),
        ])
          .then(() => done())
          .catch(done)
      })
    })
  })
})
