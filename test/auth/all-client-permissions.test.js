/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const { getApiToken } = require('../helpers/getApiToken')

let apiToken
const fakeId = '5d14c75f2d32f92ae2cc831a'

describe('Check client permissions', () => {
  before(async () => {
    apiToken = await getApiToken()
  })

  const routes = [
    { desc: 'POST projects', method: (...props) => request.post(...props), route: '/projects' },
    { desc: 'GET projects', method: (...props) => request.get(...props), route: '/projects' },
    {
      desc: 'GET projects image',
      method: (...props) => request.get(...props),
      route: `/projects/${fakeId}/image.png`,
    },
    { desc: 'PUT projects', method: (...props) => request.put(...props), route: `/projects/${fakeId}` },
    {
      desc: 'DELETE projects',
      method: (...props) => request.delete(...props),
      route: `/projects/${fakeId}`,
    },
    {
      desc: 'POST api token',
      method: (...props) => request.post(...props),
      route: `/projects/${fakeId}/api-tokens`,
    },
    {
      desc: 'GET api token',
      method: (...props) => request.get(...props),
      route: `/projects/${fakeId}/api-tokens`,
    },
    {
      desc: 'PUT api token',
      method: (...props) => request.put(...props),
      route: `/projects/${fakeId}/api-tokens/${fakeId}`,
    },
    {
      desc: 'DELETE api token',
      method: (...props) => request.delete(...props),
      route: `/projects/${fakeId}/api-tokens/${fakeId}`,
    },
    {
      desc: 'GET users',
      method: (...props) => request.get(...props),
      route: `/users`,
    },
    {
      desc: 'POST user to project',
      method: (...props) => request.post(...props),
      route: `/projects/${fakeId}/users`,
    },
    {
      desc: 'GET users of project',
      method: (...props) => request.get(...props),
      route: `/projects/${fakeId}/users`,
    },
    {
      desc: 'DELETE user of project',
      method: (...props) => request.delete(...props),
      route: `/projects/${fakeId}/users/${fakeId}`,
    },
    {
      desc: 'GET permissions of user',
      method: (...props) => request.get(...props),
      route: `/projects/${fakeId}/users/${fakeId}/permissions`,
    },
    {
      desc: 'PUT permissions of user',
      method: (...props) => request.put(...props),
      route: `/projects/${fakeId}/users/${fakeId}/permissions`,
    },
  ]

  routes.forEach(({ desc, method, route }) => {
    it(`${desc} should return 403`, done => {
      method(route)
        .set('AccessToken', apiToken.accessToken.token)
        .expect(403)
        .end(done)
    })
  })

  after(async () => {
    await apiToken.remove()
  })
})
