/*global describe, it, before, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { getAuth } = require('../helpers/getAuth')

let auth
const unvalidId = 'sad'
const fakeId = '5d14c75f2d32f92ae2cc831a'

describe('Check project id', () => {
  before(async () => {
    auth = await getAuth()
  })

  const routes = [
    {
      desc: 'GET projects image',
      method: id => request(app).get(`/projects/${id}/image.png`),
    },
    {
      desc: 'PUT projects',
      method: id => request(app).put(`/projects/${id}`),
    },
    {
      desc: 'DELETE projects',
      method: id => request(app).delete(`/projects/${id}`),
    },
    {
      desc: 'POST api tokens',
      method: id => request(app).post(`/projects/${id}/api-tokens`),
    },
    {
      desc: 'GET api tokens',
      method: id => request(app).get(`/projects/${id}/api-tokens`),
    },
    {
      desc: 'PUT api tokens',
      method: id => request(app).put(`/projects/${id}/api-tokens/${id}`),
    },
    {
      desc: 'DELETE api tokens',
      method: id => request(app).delete(`/projects/${id}/api-tokens/${id}`),
    },
    {
      desc: 'POST user to project',
      method: id => request(app).post(`/projects/${id}/users`),
    },
    {
      desc: 'GET users of project',
      method: id => request(app).get(`/projects/${id}/users`),
    },
  ]

  routes.forEach(({ desc, method }) => {
    it(`${desc} should return 404`, done => {
      method(unvalidId)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })

    it(`${desc} should return 404`, done => {
      method(fakeId)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })
  })

  after(async () => {
    await auth.remove()
  })
})
