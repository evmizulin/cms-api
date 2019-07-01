/*global describe, it, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { Project, ProjectImage } = require('../../src/services/db/Db')

let globalProjectId

describe('POST /projects', () => {
  it('should return 200', done => {
    request(app)
      .post('/projects')
      .send({ name: 'Project name' })
      .expect(200)
      .expect(res => {
        const { id, name, ...rest } = res.body
        assert.equal(name, 'Project name')
        assert.equal(id.length, 24)
        assert.deepEqual(rest, {})
        globalProjectId = id
      })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post('/projects')
      .send({ id: 'abc', name: 'Project name' })
      .expect(400, { message: 'Additional properties not allowed' })
      .end(done)
  })

  after(async () => {
    const images = await ProjectImage.find({ projectId: globalProjectId })
    const { id, projectId, buffer, ...rest } = images[0]
    assert.equal(id.toString().length, 24)
    assert.equal(projectId.toString(), globalProjectId)
    assert.equal(buffer instanceof Buffer, true)
    assert.deepEqual(rest, {})

    await Project.remove(globalProjectId)
    await ProjectImage.remove(id)
  })
})
