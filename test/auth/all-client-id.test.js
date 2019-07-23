/*global describe, it*/

const request = require('supertest')
const { app } = require('../../src/index')

const fakeAccessToken = 'ad08ddacfb97b193a843e1cb7608c28cc2aa08b8'
const fakeId = '5d14c75f2d32f92ae2cc831a'

describe('Check AccessToken', () => {
  const routes = [
    { desc: 'POST projects', method: (...props) => request(app).post(...props), route: '/projects' },
    { desc: 'GET projects', method: (...props) => request(app).get(...props), route: '/projects' },
    {
      desc: 'GET projects image',
      method: (...props) => request(app).get(...props),
      route: `/projects/${fakeId}/image.png`,
    },
    { desc: 'PUT projects', method: (...props) => request(app).put(...props), route: `/projects/${fakeId}` },
    {
      desc: 'DELETE projects',
      method: (...props) => request(app).delete(...props),
      route: `/projects/${fakeId}`,
    },
    {
      desc: 'POST api token',
      method: (...props) => request(app).post(...props),
      route: `/projects/${fakeId}/api-tokens`,
    },
    {
      desc: 'GET api token',
      method: (...props) => request(app).get(...props),
      route: `/projects/${fakeId}/api-tokens`,
    },
    {
      desc: 'PUT api token',
      method: (...props) => request(app).put(...props),
      route: `/projects/${fakeId}/api-tokens/${fakeId}`,
    },
    {
      desc: 'DELETE api token',
      method: (...props) => request(app).delete(...props),
      route: `/projects/${fakeId}/api-tokens/${fakeId}`,
    },
    {
      desc: 'GET users',
      method: (...props) => request(app).get(...props),
      route: `/users`,
    },
    {
      desc: 'POST user to project',
      method: (...props) => request(app).post(...props),
      route: `/projects/${fakeId}/users`,
    },
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
