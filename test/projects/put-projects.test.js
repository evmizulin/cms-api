/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { Project } = require('../../src/services/db/Db')

let projectId

describe('PUT /projects/${id}', () => {
  before(async () => {
    const savedProject = await Project.insert({ name: 'put-project-success-old' })
    projectId = savedProject.id.toString()
  })

  it('should return 200', done => {
    request(app)
      .put(`/projects/${projectId}`)
      .send({ id: projectId, name: 'put-project-success-new' })
      .expect(200)
      .expect(res => {
        const { id, name, ...rest } = res.body
        assert.equal(name, 'put-project-success-new')
        assert.equal(id, projectId)
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .put(`/projects/${projectId}`)
      .send({ id: '5d14c75f2d32f92ae2cc831b', name: 'put-project-fail' })
      .expect(400)
      .expect({ message: 'ID in route must be equal to ID in body' })
      .end(done)
  })

  after(async () => {
    await Project.remove(projectId)
  })
})
