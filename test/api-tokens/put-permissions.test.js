/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getDefaultProjectPermissions } = require('../../src/helpers/getDefaultProjectPermissions')
const { getApiToken } = require('../helpers/getApiToken')

describe('PUT /projects/${id}/api-tokens/${id}/permissions', () => {
  let auth
  let project
  let userProjectPermission
  let apiToken
  let tokenProjectPermission

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
    apiToken = await getApiToken()
    tokenProjectPermission = await getProjectPermission(apiToken, project)
  })

  it('should return 200', done => {
    const defaultPermissions = getDefaultProjectPermissions('app')
    request
      .put(`/projects/${project.project.id}/api-tokens/${apiToken.app.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({
        apiTokenId: apiToken.app.id,
        projectId: project.project.id,
        ...Object.keys(defaultPermissions).reduce((res, key) => {
          res[key] = defaultPermissions[key]
          if (key === 'fileRead') res[key] = false
          return res
        }, {}),
      })
      .expect(200)
      .expect(res => {
        const { apiTokenId, projectId, fileRead, ...rest } = res.body
        delete defaultPermissions.fileRead
        assert.equal(apiTokenId, apiToken.app.id.toString())
        assert.equal(projectId, project.project.id.toString())
        assert.equal(fileRead, false)
        assert.deepEqual(rest, defaultPermissions)
      })
      .end(done)
  })

  it('should return 400', done => {
    request
      .put(`/projects/${project.project.id}/api-tokens/${apiToken.app.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({})
      .expect(400)
      .end(done)
  })

  it('should return 400', done => {
    request
      .put(`/projects/${project.project.id}/api-tokens/${apiToken.app.id}/permissions`)
      .set('AccessToken', auth.accessToken.token)
      .send({
        apiTokenId: project.project.id,
        projectId: project.project.id,
        ...getDefaultProjectPermissions('app'),
      })
      .expect(400, { message: 'ID in route must be equal to ID in body' })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
    await apiToken.remove()
    await tokenProjectPermission.remove()
  })
})
