/*global describe, it, before, after*/

const { request } = require('../helpers/request')
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
      method: id => request.get(`/projects/${id}/image.png`),
    },
    {
      desc: 'PUT projects',
      method: id => request.put(`/projects/${id}`),
    },
    {
      desc: 'DELETE projects',
      method: id => request.delete(`/projects/${id}`),
    },
    {
      desc: 'POST api tokens',
      method: id => request.post(`/projects/${id}/api-tokens`),
    },
    {
      desc: 'GET api tokens',
      method: id => request.get(`/projects/${id}/api-tokens`),
    },
    {
      desc: 'PUT api tokens',
      method: id => request.put(`/projects/${id}/api-tokens/${id}`),
    },
    {
      desc: 'DELETE api tokens',
      method: id => request.delete(`/projects/${id}/api-tokens/${id}`),
    },
    {
      desc: 'POST user to project',
      method: id => request.post(`/projects/${id}/users`),
    },
    {
      desc: 'GET users of project',
      method: id => request.get(`/projects/${id}/users`),
    },
    {
      desc: 'DELETE users of project',
      method: id => request.delete(`/projects/${id}/users/${id}`),
    },
    {
      desc: 'GET permissions of user',
      method: id => request.get(`/projects/${id}/users/${id}/permissions`),
    },
    {
      desc: 'PUT permissions of user',
      method: id => request.put(`/projects/${id}/users/${id}/permissions`),
    },
    {
      desc: 'POST file',
      method: id => request.post(`/projects/${id}/files`),
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
