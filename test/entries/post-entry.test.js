/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { Entry } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')
const randomstring = require('randomstring')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getModel } = require('../helpers/getModel')

let auth
let project
let userProjectPermission
let model
let reqEntry
let resEntry

describe('POST /projects/${id}/entries', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
    model = await getModel(project)
    reqEntry = {
      identificator: randomstring.generate(),
      modelId: model.model.id,
      value: { type: 'string-line', value: randomstring.generate() },
    }
  })

  it('should return 200', done => {
    request
      .post(`/projects/${project.project.id}/entries`)
      .set('AccessToken', auth.accessToken.token)
      .send(reqEntry)
      .expect(200)
      .expect(res => {
        const { id, modelId, identificator, value, ...rest } = res.body
        assert.equal(id.length, 24)
        assert.equal(modelId, model.model.id.toString())
        assert.equal(identificator, reqEntry.identificator)
        assert.deepEqual(value, reqEntry.value)
        assert.deepEqual(rest, {})
        resEntry = res.body
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
    await model.remove()
    await Entry.remove(resEntry.id)
  })
})
