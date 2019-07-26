/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getApiToken } = require('../helpers/getApiToken')

let auth
let project
let userProjectPermission
let apiToken
let projectPermission

describe('PUT /projects/${id}/api-tokens/${id}', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
    apiToken = await getApiToken()
    projectPermission = await getProjectPermission(apiToken, project)
  })

  it('should return 200', done => {
    request
      .put(`/projects/${project.project.id}/api-tokens/${apiToken.app.id}`)
      .set('AccessToken', auth.accessToken.token)
      .send({ id: apiToken.app.id, name: 'api-token-name' })
      .expect(200)
      .expect(res => {
        const { id, name, token, ...rest } = res.body
        assert.equal(id, apiToken.app.id.toString())
        assert.equal(name, 'api-token-name')
        assert.equal(token, apiToken.accessToken.token)
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  it('should return 400', done => {
    request
      .put(`/projects/${project.project.id}/api-tokens/${apiToken.app.id}`)
      .set('AccessToken', auth.accessToken.token)
      .send({ id: '5d14c75f2d32f92ae2cc831b', name: 'put-project-fail' })
      .expect(400)
      .expect({ message: 'ID in route must be equal to ID in body' })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
    await apiToken.remove()
    await projectPermission.remove()
  })
})
