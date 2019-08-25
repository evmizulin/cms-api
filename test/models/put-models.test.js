/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getModel } = require('../helpers/getModel')
const randomstring = require('randomstring')

let auth
let project
let userProjectPermission
let model

describe('PUT /projects/${id}/models', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
    model = await getModel(project)
  })

  it('should return 200', done => {
    request
      .put(`/projects/${project.project.id}/models/${model.model.id}`)
      .set('AccessToken', auth.accessToken.token)
      .send({
        id: model.model.id,
        apiId: randomstring.generate(),
        type: 'string-line',
        title: randomstring.generate(),
      })
      .expect(200)
      .expect(res => {
        const { id, apiId, title, type, ...rest } = res.body
        assert.equal(id, model.model.id.toString())
        assert.equal(type, 'string-line')
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
    await model.remove()
  })
})
