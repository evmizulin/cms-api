/*global describe, it*/

const request = require('supertest')
const { app } = require('../../src/index')

describe('POST /projects', () => {
  it('should return 200', done => {
    request(app)
      .post('/projects')
      .send({ a: 111 })
      .expect(200, { message: 'OK' })
      .end(done)
  })
})
