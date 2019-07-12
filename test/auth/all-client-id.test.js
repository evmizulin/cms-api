/*global describe, it*/

const request = require('supertest')
const { app } = require('../../src/index')

const fakeAccessToken = 'ad08ddacfb97b193a843e1cb7608c28cc2aa08b8'
const fakeId = '5d14c75f2d32f92ae2cc831a'

describe('Check AccessToken in projects', () => {
  const routes = [
    { desc: 'POST', method: (...props) => request(app).post(...props), route: '/projects' },
    { desc: 'GET', method: (...props) => request(app).get(...props), route: '/projects' },
    {
      desc: 'GET',
      method: (...props) => request(app).get(...props),
      route: `/projects/${fakeId}/image.png`,
    },
    { desc: 'PUT', method: (...props) => request(app).put(...props), route: `/projects/${fakeId}` },
    { desc: 'DELETE', method: (...props) => request(app).delete(...props), route: `/projects/${fakeId}` },
  ]

  routes.forEach(({ desc, method, route }) => {
    it(`${desc} should return 401`, done => {
      method(route)
        .expect(401)
        .end(done)
    })

    it(`${desc} should return 401`, done => {
      method(route)
        .set('AccessToken', fakeAccessToken)
        .expect(401)
        .end(done)
    })
  })
})
