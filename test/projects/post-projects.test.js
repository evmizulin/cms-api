/*global describe, it, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { Project } = require('../../src/services/db/Db')

const ids = []

describe('POST /projects', () => {
  it('should return 200', done => {
    request(app)
      .post('/projects')
      .send({ name: 'Project name' })
      .expect(200)
      .expect(res => {
        const { id, image, name, ...rest } = res.body
        assert.equal(name, 'Project name')
        assert.equal(image.indexOf('data:image/png;base64'), 0)
        assert.equal(id.length, 24)
        assert.deepEqual(rest, {})
        ids.push(id)
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
    for (let i = 0; i < ids.length; i++) {
      await Project.remove(ids[i])
    }
  })
})
