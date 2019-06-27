/*global describe, it, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const { Project } = require('../../src/services/db/Db')

let projectId

describe('DELETE /projects/${id}', () => {
  before(async () => {
    const savedProject = await Project.insert({ name: 'My project', image: 'png' })
    projectId = savedProject.id.toString()
  })

  it('should return 200', done => {
    request(app)
      .delete(`/projects/${projectId}`)
      .expect(200)
      .expect({ message: 'OK' })
      .end(done)
  })

  it('should return 404', done => {
    const fakeId = '5d14c75f2d32f92ae2cc831a'
    request(app)
      .delete(`/projects/${fakeId}`)
      .expect(404)
      .end(done)
  })

  it('should return 400', done => {
    const fakeId = 'sad'
    request(app)
      .delete(`/projects/${fakeId}`)
      .expect(400)
      .end(done)
  })
})
