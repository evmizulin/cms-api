/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { Project } = require('../../src/services/db/Db')

let projectId

describe('GET /projects', () => {
  before(async () => {
    const savedProject = await Project.insert({ name: 'Get project' })
    projectId = savedProject.id.toString()
  })

  it('should return 200', done => {
    request(app)
      .get('/projects')
      .expect(200)
      .expect(res => {
        const { id, name, ...rest } = res.body.find(item => item.id === projectId)
        assert.equal(name, 'Get project')
        assert.equal(id, projectId)
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  after(async () => {
    await Project.remove(projectId)
  })
})
