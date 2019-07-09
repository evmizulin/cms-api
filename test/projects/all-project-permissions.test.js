/*global describe, it, before, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { getAuth } = require('./helpers/getAuth')
const { getProject } = require('./helpers/getProject')

let auth
let project

describe('Check permissions in projects', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
  })

  const routes = [
    {
      desc: 'GET',
      method: (...props) => request(app).delete(...props),
      route: () => `/projects/${project.project.id}/image.png`,
    },
    {
      desc: 'PUT',
      method: (...props) => request(app).put(...props),
      route: () => `/projects/${project.project.id}`,
    },
    {
      desc: 'DELETE',
      method: (...props) => request(app).delete(...props),
      route: () => `/projects/${project.project.id}`,
    },
  ]

  routes.forEach(({ desc, method, route }) => {
    it(`${desc} should return 404`, done => {
      method(route())
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })
  })

  after(async () => {
    await auth.remove()
    await project.remove()
  })
})
