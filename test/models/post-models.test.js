/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { Model } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')
const randomstring = require('randomstring')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

let auth
let project
let userProjectPermission
const reqModel = { apiId: randomstring.generate(), type: 'string-line', title: randomstring.generate() }
let resModel

describe('POST /projects/${id}/models', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
  })

  it('should return 200', done => {
    request
      .post(`/projects/${project.project.id}/models`)
      .set('AccessToken', auth.accessToken.token)
      .send(reqModel)
      .expect(200)
      .expect(res => {
        const { id, apiId, type, title, ...rest } = res.body
        assert.equal(id.length, 24)
        assert.equal(apiId, reqModel.apiId)
        assert.equal(type, reqModel.type)
        assert.equal(title, reqModel.title)
        assert.deepEqual(rest, {})
        resModel = res.body
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
    await Model.remove(resModel.id)
  })
})
