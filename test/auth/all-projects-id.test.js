/*global describe, it, before, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { getAuth } = require('../helpers/getAuth')

let auth
const unvalidId = 'sad'
const fakeId = '5d14c75f2d32f92ae2cc831a'

describe('Check project id /projects/${id}', () => {
  before(async () => {
    auth = await getAuth()
  })

  const routes = [
    {
      desc: 'GET',
      method: (...props) => request(app).get(...props),
      route: `/projects/${unvalidId}/image.png`,
    },
    {
      desc: 'GET',
      method: (...props) => request(app).get(...props),
      route: `/projects/${fakeId}/image.png`,
    },
    {
      desc: 'PUT',
      method: (...props) => request(app).put(...props),
      route: `/projects/${unvalidId}`,
    },
    {
      desc: 'PUT',
      method: (...props) => request(app).put(...props),
      route: `/projects/${fakeId}`,
    },
    {
      desc: 'DELETE',
      method: (...props) => request(app).delete(...props),
      route: `/projects/${unvalidId}`,
    },
    {
      desc: 'DELETE',
      method: (...props) => request(app).delete(...props),
      route: `/projects/${fakeId}`,
    },
  ]

  routes.forEach(({ desc, method, route }) => {
    it(`${desc} should return 404`, done => {
      method(route)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })
  })

  after(async () => {
    await auth.remove()
  })
})
