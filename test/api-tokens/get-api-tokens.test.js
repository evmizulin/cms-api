/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getApiToken } = require('../helpers/getApiToken')

describe('GET /api-tokens', () => {
  describe('Empty array', () => {
    let auth
    let project
    let projectPermission

    before(async () => {
      auth = await getAuth()
      project = await getProject()
      projectPermission = await getProjectPermission(auth, project)
    })

    it('should return 200', done => {
      request(app)
        .get(`/projects/${project.project.id}/api-tokens`)
        .set('AccessToken', auth.accessToken.token)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.length, 0)
        })
        .end(done)
    })

    after(async () => {
      await auth.remove()
      await project.remove()
      await projectPermission.remove()
    })
  })

  describe('Filled array', () => {
    let auth
    let project
    let userProjectPermission
    let apiToken
    let apiTokenProjectPermission

    before(async () => {
      auth = await getAuth()
      project = await getProject()
      userProjectPermission = await getProjectPermission(auth, project)
      apiToken = await getApiToken()
      apiTokenProjectPermission = await getProjectPermission(apiToken, project)
    })

    it('should return 200', done => {
      request(app)
        .get(`/projects/${project.project.id}/api-tokens`)
        .set('AccessToken', auth.accessToken.token)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.length, 1)
          const { id, name, token, ...rest } = res.body[0]
          assert.equal(id, apiToken.app.id.toString())
          assert.equal(name, apiToken.app.name)
          assert.equal(token, apiToken.accessToken.token)
          assert.deepEqual(rest, {})
        })
        .end(done)
    })

    after(async () => {
      await auth.remove()
      await project.remove()
      await userProjectPermission.remove()
      await apiToken.remove()
      await apiTokenProjectPermission.remove()
    })
  })
})
