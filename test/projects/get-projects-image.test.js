/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const { ProjectImage } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

let auth
let project
let projectImage
let projectPermission

describe('GET /projects/${id}/image.png', () => {
  before(async () => {
    auth = await getAuth()
    project = await getProject()
    projectImage = await ProjectImage.insert({ projectId: project.project.id, buffer: new Buffer(1) })
    projectPermission = await getProjectPermission(auth, project)
  })

  it('should return 200', done => {
    request(app)
      .get(`/projects/${project.project.id}/image.png`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect('Content-Type', 'image/png')
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await project.remove()
    await projectPermission.remove()
    await ProjectImage.remove(projectImage.id)
  })
})
