/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getModel } = require('../helpers/getModel')
const { getEntry } = require('../helpers/getEntry')

describe('GET /projects/${id}/entries', () => {
  let auth
  let project
  let projectPermission
  let model
  let entry

  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
    model = await getModel(project)
    entry = await getEntry(model)
  })

  it('should return 200', done => {
    request
      .get(`/projects/${project.project.id}/entries`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.length, 1)
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
    await model.remove()
    await entry.remove()
  })
})
