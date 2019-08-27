/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const { getModel } = require('../helpers/getModel')
const { getEntry } = require('../helpers/getEntry')

let auth
let project
let projectPermission
let model

describe('DELETE /projects/${id}/models', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectPermission = await getProjectPermission(auth, project)
    model = await getModel(project)
    await getEntry(model)
  })

  it('should return 200', done => {
    request
      .delete(`/projects/${project.project.id}/models/${model.model.id}`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
  })
})
