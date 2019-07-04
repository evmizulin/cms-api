/*global describe, it, before, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { Project, ProjectImage } = require('../../src/services/db/Db')

let projectId
let projectImageId

describe('GET /projects/${id}/image.png', () => {
  before(async () => {
    const savedProject = await Project.insert({ name: 'My project' })
    const savedImage = await ProjectImage.insert({ projectId: savedProject.id, buffer: new Buffer(1) })
    projectId = savedProject.id.toString()
    projectImageId = savedImage.id.toString()
  })

  it('should return 200', done => {
    request(app)
      .get(`/projects/${projectId}/image.png`)
      .expect(200)
      .expect('Content-Type', 'image/png')
      .end(done)
  })

  after(async () => {
    await Project.remove(projectId)
    await ProjectImage.remove(projectImageId)
  })
})
