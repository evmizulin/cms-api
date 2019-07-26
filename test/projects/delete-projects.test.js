/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { ProjectImage } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

let auth
let project

describe('DELETE /projects/${id}', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    await getProjectPermission(auth, project)
    await ProjectImage.insert({ projectId: project.project.id, buffer: new Buffer(1) })
  })

  it('should return 200', done => {
    request
      .delete(`/projects/${project.project.id}`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect({ message: 'OK' })
      .end(done)
  })

  after(async () => {
    await auth.remove()
  })
})
