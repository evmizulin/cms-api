/*global describe, it, before, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { Project, ProjectImage } = require('../../src/services/db/Db')
const assert = require('assert')

let projectId
let projectImageId

describe('DELETE /projects/${id}', () => {
  before(async () => {
    const savedProject = await Project.insert({ name: 'My project' })
    const savedImage = await ProjectImage.insert({ projectId: savedProject.id, buffer: new Buffer(1) })
    projectId = savedProject.id.toString()
    projectImageId = savedImage.id.toString()
  })

  it('should return 200', done => {
    request(app)
      .delete(`/projects/${projectId}`)
      .expect(200)
      .expect({ message: 'OK' })
      .end(done)
  })

  after(async () => {
    const deletedProject = await Project.findById(projectId)
    const deletedImage = await ProjectImage.findById(projectImageId)
    assert.equal(!deletedProject, true)
    assert.equal(!deletedImage, true)
  })
})
