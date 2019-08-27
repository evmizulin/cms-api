/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getModel } = require('../helpers/getModel')
const randomstring = require('randomstring')
const { getEntry } = require('../helpers/getEntry')

let auth
let project
let userProjectPermission
let model
let entry

describe('PUT /projects/${id}/entries/${id}', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    userProjectPermission = await getProjectPermission(auth, project)
    model = await getModel(project)
    entry = await getEntry(model)
  })

  it('should return 200', done => {
    request
      .put(`/projects/${project.project.id}/entries/${entry.entry.id}`)
      .set('AccessToken', auth.accessToken.token)
      .send({
        id: entry.entry.id,
        identificator: randomstring.generate(),
        modelId: model.model.id,
        value: { type: 'string-line', value: randomstring.generate() },
      })
      .expect(200)
      .expect(res => {
        const { id } = res.body
        assert.equal(id, entry.entry.id.toString())
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await userProjectPermission.remove()
    await model.remove()
    await entry.remove()
  })
})
